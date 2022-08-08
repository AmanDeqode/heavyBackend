import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { Hash } from 'src/database/entities/hash.entity';
import { HashRepository } from 'src/database/repositories/hash.repository';

@Processor('upload-queue')
export class UploadProcessor {
  constructor(@InjectRepository(Hash) private hashRepository: HashRepository) {}

  //   @OnQueueActive()
  //   onActive(job: Job) {
  //     this.logger.debug(`Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(job.data)}`)
  //   }

  //   @OnQueueCompleted()
  //   onComplete(job: Job, result: any) {
  //     this.logger.debug(`Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(result)}`)
  //   }

  //   @OnQueueFailed()
  //   onError(job: Job<any>, error: any) {
  //     this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack)
  //   }

  @Process('hashDetails')
  async processFile(job: Job) {
    console.log('job', job);
  }
}
