import { Token } from '../enum/token.enum';
import { ITokenBase } from './token-base.interface';

export interface IRefreshToken extends ITokenBase {
  aud: Token.REFRESH;
}
