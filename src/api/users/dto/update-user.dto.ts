import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { UserRole } from '../../../constants/user-type.enum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  id: string;

  @IsOptional()
  @IsBoolean()
  @Transform((transformParam) => transformParam.value === 'true')
  status: boolean;

  @IsOptional()
  @IsIn(Object.values(UserRole))
  role: string;
}
