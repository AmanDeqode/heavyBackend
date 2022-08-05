import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '../config/config.service';
import { Token } from './enum/token.enum';
import { IAccessToken } from './interfaces/access-token.interface';
import { IRefreshToken } from './interfaces/refresh-token.interface';
import { ITokenBase } from './interfaces/token-base.interface';

@Injectable()
export class TokenService {
  constructor(private readonly config: ConfigService) {}

  private signToken(
    payload: { tokenId: string },
    audience: Token,
    subject: string,
    expiresIn: number,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(
        payload,
        this.config.get('secretHex'),
        { audience, subject, expiresIn },
        (err, encoded) => {
          if (err || !encoded) {
            return reject(err);
          }
          resolve(encoded);
        },
      );
    });
  }

  signAccessToken(id: string, payload: { tokenId: string }): Promise<string> {
    return this.signToken(
      payload,
      Token.ACCESS,
      id,
      this.config.get('accessTokenLifetime') * 60,
    );
  }

  signRefreshToken(id: string, payload: { tokenId: string }): Promise<string> {
    return this.signToken(
      payload,
      Token.REFRESH,
      id,
      this.config.get('refreshTokenLifetime') * 60,
    );
  }

  verifyToken(token: string, audience: Token): Promise<ITokenBase> {
    return new Promise((resolve, reject) => {
      verify(
        token,
        this.config.get('secretHex'),
        { audience },
        (err, decoded) => {
          if (err || !decoded) {
            return reject(err);
          }
          resolve(decoded as ITokenBase);
        },
      );
    });
  }

  isAccessToken(payload: ITokenBase): payload is IAccessToken {
    return payload.aud === Token.ACCESS;
  }

  isRefreshToken(payload: ITokenBase): payload is IRefreshToken {
    return payload.aud === Token.REFRESH;
  }
}
