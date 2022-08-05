import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { TokenService } from './token.service';

@Module({
  imports: [ConfigModule],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
