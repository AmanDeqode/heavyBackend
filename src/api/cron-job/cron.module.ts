import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HashRepository } from 'src/database/repositories/hash.repository';
import { CronService } from './cron.service';
import { BullBoardController } from '../bull-board/bull-board.controller';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          redis: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    BullModule.registerQueueAsync({
      name: 'upload-hash',
    }),
    TypeOrmModule.forFeature([HashRepository]),
  ],
  providers: [CronService, BullBoardController],
})
export class CronModule {}
