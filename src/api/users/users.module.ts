import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule } from '../../config/config.module';
import { TokenModule } from '../../token/token.module';
import { AuthenticateMiddleware } from '../../authenticate/authenticate.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../../database/repositories/user.repository';
import { UsersTokenRepository } from '../../database/repositories/user-token.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository, UsersTokenRepository]),
    TokenModule,
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticateMiddleware).forRoutes('users');
  }
}
