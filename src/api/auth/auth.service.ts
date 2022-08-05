import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { of } from 'await-of';
import { v4 } from 'uuid';

import { TokenService } from '../../token/token.service';
import { ConfigService } from '../../config/config.service';
import { comparePassword } from '../../utils/password';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './interface/login-response.interface';
import { RefreshDto } from './dto/refresh.dto';
import { Token } from '../../token/enum/token.enum';
import { RefreshResponse } from './interface/refresh-response.interface';
import { UserTokens } from '../../database/entities/user-token.entity';
import { UserTokenSchema } from './interface/logout-request.interface';
import { UsersRepository } from '../../database/repositories/user.repository';
import { UsersTokenRepository } from '../../database/repositories/user-token.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userTokensRepository: UsersTokenRepository,
    private readonly config: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findByEmail(loginDto.email, {
      select: ['id', 'password', 'status'],
    });
    if (!user) {
      throw new UnauthorizedException('Incorrect credentials.');
    }

    const passwordMatched = await comparePassword(
      loginDto.password,
      user.password,
    );

    if (!passwordMatched) {
      throw new UnauthorizedException('Incorrect credentials.');
    }

    if (!user.status) {
      throw new BadRequestException(
        'User is not active. Please call to support.',
      );
    }

    const payload: { tokenId: string } = {
      tokenId: v4(),
    };

    const accessToken = await this.tokenService.signAccessToken(
      user.id,
      payload,
    );
    const refreshToken = await this.tokenService.signRefreshToken(
      user.id,
      payload,
    );

    const expiresIn = this.config.get('accessTokenLifetime') * 60;
    const userToken = new UserTokens();
    userToken.user = user.id as any;
    userToken.tokenId = payload.tokenId;
    userToken.expiresIn = expiresIn;
    await userToken.save();

    const loginResponse: LoginResponse = {
      tokenType: 'bearer',
      accessToken,
      expiresIn,
      refreshToken,
    };

    return loginResponse;
  }

  async refresh(refresh: RefreshDto) {
    const [decoded, error] = await of(
      this.tokenService.verifyToken(refresh.refreshToken, Token.REFRESH),
    );

    if (error || !this.tokenService.isRefreshToken(decoded)) {
      throw new BadRequestException(
        'Provided token is not valid refresh token',
      );
    }

    const user = await this.usersRepository.findOne(decoded.sub);

    if (!user) {
      throw new UnauthorizedException('Incorrect credentials.');
    }

    if (!user.status) {
      throw new BadRequestException(
        'User is not active. Please call to support.',
      );
    }

    const payload: { tokenId: string } = {
      tokenId: v4(),
    };

    const accessToken = await this.tokenService.signAccessToken(
      user.id,
      payload,
    );
    const newRefreshToken = await this.tokenService.signRefreshToken(
      user.id,
      payload,
    );

    const expiresIn = this.config.get('accessTokenLifetime') * 60;
    const userToken = new UserTokens();
    userToken.user = user.id as any;
    userToken.tokenId = payload.tokenId;
    userToken.expiresIn = expiresIn;
    await userToken.save();

    const refreshResponse: RefreshResponse = {
      tokenType: 'bearer',
      accessToken,
      expiresIn,
      newRefreshToken,
    };

    return refreshResponse;
  }

  async logout(user: UserTokenSchema) {
    const userTokens = await this.userTokensRepository.getTokensById(user.id);
    const userToken = userTokens.find(
      (userToken) => (userToken.tokenId = user.tokenId),
    );

    if (userToken) {
      await this.userTokensRepository.delete(userToken.id);
    }
  }
}
