import { Users } from '../../../database/entities/user.entity';

export interface UserTokenSchema extends Users {
  tokenId: string;
}
