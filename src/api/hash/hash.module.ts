import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HashController } from './hash.controller';
import { HashService } from './hash.service';
import { HashRepository } from 'src/database/repositories/hash.repository';
import { CronModule } from '../cron-job/cron.module';

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
    BullModule.registerQueue({
      name: 'upload-hash',
    }),
    TypeOrmModule.forFeature([HashRepository]),
    CronModule,
  ],
  controllers: [HashController],
  providers: [HashService],
  exports: [HashService],
})
export class HashModule {}
