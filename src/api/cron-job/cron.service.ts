import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { of } from 'await-of';
import { Queue } from 'bull';
import { Hash, ResultStatusEnum } from 'src/database/entities/hash.entity';
import { HashRepository } from 'src/database/repositories/hash.repository';
import dotenv from 'dotenv';

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
              start_process_nonce: 0,
              end_process_nonce:
                parseInt(last_process_nonce) +
                parseInt(process.env.MAX_PROCESS),
            },
            status,
          });
          await this.hashRepository.update(
            {
              id: id,
            },
            {
              last_process_nonce: addJob.data.nonce_range.end_process_nonce,
            },
          );
        } catch (error) {
          console.log('codsed');
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
