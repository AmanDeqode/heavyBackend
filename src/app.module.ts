import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './api/auth/auth.module';
import typeormConfig from './database/config/typeorm.config';
import { AppController } from './app.controller';
import { HashModule } from './api/hash/hash.module';
import { CronModule } from './api/cron-job/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BullBoardController } from './api/bull-board/bull-board.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(typeormConfig),
    ConfigModule,
    AuthModule,
    HashModule,
    CronModule,
  ],
  controllers: [AppController, BullBoardController],
  providers: [],
})
export class AppModule {}
