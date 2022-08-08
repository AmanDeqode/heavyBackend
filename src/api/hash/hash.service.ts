import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashDto } from './dto/hash.dto';
import { HashRepository } from 'src/database/repositories/hash.repository';
import { Hash, ResultStatusEnum } from 'src/database/entities/hash.entity';
import moment from 'moment';
import { of } from 'await-of';

@Injectable()
export class HashService {
  constructor(@InjectRepository(Hash) private hashRepository: HashRepository) {}

  async uploadData(hashDto: HashDto) {
    try {
      console.log('req.connection.remoteAddress', hashDto);
      const { inputHex, ipAddress } = hashDto;
      console.log('hashDto', hashDto);
      const [checkIP, ipError] = await of(
        this.hashRepository.find({
          where: {
            ip_address: ipAddress,
          },
        }),
      );
      if (ipError) throw new Error('something went wrong');

      if (checkIP) {
        const createdDate = checkIP[0]?.createdAt;
        const currentEpoch = Math.floor(Date.now() / 1000);
        const createdEpoch = moment(createdDate).unix();
        if (createdEpoch - currentEpoch < parseInt(process.env.LIMIT)) {
          const result = this.save(inputHex, ipAddress);
          return result;
        } else {
          return {
            message: 'hash value is already present',
          };
        }
      }
      const response = this.save(inputHex, ipAddress);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async save(inputHex: string, ipAddress: string) {
    const hashData = new Hash();
    hashData.input_hex = inputHex;
    hashData.ip_address = ipAddress;
    hashData.status = ResultStatusEnum.PENDING;

    const [insertHash, hashError] = await of(hashData.save());

    if (hashError) throw new Error('Error in inserting data');
    if (insertHash) {
      return {
        message: 'Record has been inserted successfully',
        providedHex: inputHex,
      };
    }
  }

  async getHashInfo(hex: string) {
    const [fetchData, fetchError] = await of(
      this.hashRepository.find({
        where: {
          input_hex: hex,
        },
      }),
    );
    if (fetchError) throw new Error('Error in fetching data for given hash');
    if (!fetchData)
      return {
        data: [],
        message: 'Hash entry in not available into the database',
      };
    if (fetchData) return fetchData;
  }
}
