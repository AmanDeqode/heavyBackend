import { Token } from '../enum/token.enum';
import { ITokenBase } from './token-base.interface';

export interface IAccessToken extends ITokenBase {
  aud: Token.ACCESS;
}
