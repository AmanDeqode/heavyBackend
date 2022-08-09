import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { of } from 'await-of';
import { Queue } from 'bull';
import { Hash, ResultStatusEnum } from 'src/database/entities/hash.entity';
import { HashRepository } from 'src/database/repositories/hash.repository';
import dotenv from 'dotenv';
import BigNumber from 'bignumber.js';

dotenv.config();

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(Hash) private hashRepository: HashRepository,
    @InjectQueue('upload-hash') private hashQueue: Queue,
  ) {}

  async bullProducer(): Promise<any> {
    const [pendingHash, hashError] = await of(
      this.hashRepository.find({
        where: {
          status: ResultStatusEnum.PENDING,
        },
      }),
    );

    if (hashError) throw new Error('Error in finding data into database');
    if (pendingHash && pendingHash.length) {
      for (let hash = 0; hash < pendingHash.length; hash++) {
        const { id, input_hex, last_process_nonce, status } = pendingHash[hash];
        try {
          const addJob = await this.hashQueue.add('valid-nonce', {
            id,
            input_hex,
            nonce_range: {
              start_process_nonce: new BigNumber(last_process_nonce),
              end_process_nonce: new BigNumber(last_process_nonce).plus(
                new BigNumber(process.env.MAX_PROCESS),
              ),
            },
            status,
          });
          console.log('job id', addJob.id);
          await this.hashRepository.update(
            {
              id: id,
            },
            {
              last_process_nonce:
                addJob.data.nonce_range.end_process_nonce.toString(),
            },
          );
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    await of(this.bullProducer());
  }
}
