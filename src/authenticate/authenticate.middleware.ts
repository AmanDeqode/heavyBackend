import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { utc } from 'moment';

import { Token } from '../token/enum/token.enum';
import { TokenService } from '../token/token.service';
import { UsersRepository } from '../database/repositories/user.repository';
import { UsersTokenRepository } from '../database/repositories/user-token.repository';

@Injectable()
export class AuthenticateMiddleware implements NestMiddleware {
  constructor(
    private readonly tokenService: TokenService,
    private readonly usersRepository: UsersRepository,
    private readonly userTokensRepository: UsersTokenRepository,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new UnauthorizedException('JWT token is missing'));
    }

    const [, token] = authHeader.split(' ');

    try {
      const decoded = await this.tokenService.verifyToken(token, Token.ACCESS);

      if (utc().isSameOrAfter(utc(decoded.exp * 1000))) {
        return next(
          new UnauthorizedException('Access token has been expired.'),
        );
      }

      if (!this.tokenService.isAccessToken(decoded)) {
        throw new BadRequestException(
          'Provided token is not valid access token',
        );
      }

      const user = await this.usersRepository.findOne(decoded.sub);
      if (!user) {
        return next(new UnauthorizedException('User does not exist.'));
      }

      const userTokens = await this.userTokensRepository.getTokensById(user.id);
      const userToken = userTokens.find(
        (userToken) => userToken.tokenId === decoded.tokenId,
      );

      if (!userToken) {
        return next(
          new UnauthorizedException('access token is got invalidated.'),
        );
      }

      if (!user.isAdmin) {
        return next(
          new ForbiddenException('You are not allowed to access this api'),
        );
      }

      req['user'] = { ...user, tokenId: userToken.tokenId };

      return next();
    } catch (err) {
      return next(
        new UnauthorizedException('Invalid JWT token', 'INVALID_TOKEN'),
      );
    }
  }
}
