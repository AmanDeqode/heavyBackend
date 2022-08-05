import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '../../config/config.module';
import { TokenModule } from '../../token/token.module';
import { AuthenticateMiddleware } from '../../authenticate/authenticate.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../../database/repositories/user.repository';
import { UsersTokenRepository } from '../../database/repositories/user-token.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository, UsersTokenRepository]),
    ConfigModule,
    TokenModule,
    UsersModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateMiddleware)
      .forRoutes('auth/refresh', 'auth/logout');
  }
}
