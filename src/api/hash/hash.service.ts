import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashDto } from './dto/hash.dto';
import { HashRepository } from '../../database/repositories/hash.repository';
import { Hash, ResultStatusEnum } from '../../database/entities/hash.entity';
import moment from 'moment';
import { of } from 'await-of';

@Injectable()
export class HashService {
  constructor(@InjectRepository(Hash) private hashRepository: HashRepository) {}

  async uploadData(hashDto: HashDto) {
    try {
      const { inputHex, ipAddress } = hashDto;
      if (!inputHex || !ipAddress) throw new Error('Invalid input data');
      const isVaildHex = this.validateInputHex(inputHex);
      if (isVaildHex === null) throw new Error('Given input hex is invalid');
      const [checkIP, ipError] = await of(
        this.hashRepository.find({
          where: {
            ip_address: ipAddress,
          },
        }),
      );
      if (ipError) throw new Error('something went wrong');
      if (checkIP && checkIP.length > 0) {
        const createdDate = checkIP[0]?.createdAt;
        const currentEpoch = Math.floor(Date.now() / 1000);
        const createdEpoch = moment(createdDate).unix();
        if (currentEpoch - createdEpoch > parseInt(process.env.LIMIT)) {
          const result = this.save(inputHex, ipAddress);
          return result;
        } else {
          return {
            message: 'same hash with same IP only accept after 24 hr',
            statusCode: 401,
          };
        }
      } else {
        const response = this.save(inputHex, ipAddress);
        return response;
      }
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

  validateInputHex(inputHex: string) {
    const hexaPattern = /^[0-9a-fA-F]+$/;
    return inputHex.match(hexaPattern);
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
