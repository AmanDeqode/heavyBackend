import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import typeormConfig from './database/config/typeorm.config';
import { AppController } from './app.controller';
import { HashModule } from './api/hash/hash.module';
import { CronModule } from './api/cron-job/cron.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(typeormConfig),
    ConfigModule,
    HashModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
