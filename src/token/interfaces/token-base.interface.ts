import { Token } from '../enum/token.enum';

export interface ITokenBase {
  tokenId: string;
  jti: string;
  aud: Token;
  sub: string;
  iat: number;
  exp: number;
}
