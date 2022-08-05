import { BadRequestException, Injectable } from '@nestjs/common';
import { map } from 'lodash';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from '../../utils/password';
import { UserResponse } from './interface/user.response';
import { Users } from '../../database/entities/user.entity';
import { UserRole } from '../../constants/user-type.enum';
import { UsersRepository } from '../../database/repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const alreadyExistUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (alreadyExistUser) {
      throw new BadRequestException(
        `user with email id ${createUserDto.email} already exist`,
      );
    }

    const user = new Users();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = await hashPassword(createUserDto.password);
    user.role = UserRole.USER;
    await user.save();
  }

  async getUsers(page: number, perPage: number) {
    const count = await this.usersRepository.count();
    const users = await this.usersRepository.find({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      count,
      users: map(users, this.prepareUserResponse),
    };
  }

  async getUser(id: string) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      return { user: null };
    }

    const userResponse = this.prepareUserResponse(user);
    return { user: userResponse };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new BadRequestException(`User with id : ${id} does not exist`);
    }

    user.name = updateUserDto.name ?? user.name;
    user.email = updateUserDto.email ?? user.email;
    user.status = updateUserDto.status ?? user.status;
    user.role = updateUserDto.role ?? user.role;
    user.password = updateUserDto.password
      ? await hashPassword(updateUserDto.password)
      : user.password;

    user.save();
  }

  prepareUserResponse(user: Users): UserResponse {
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;

    const userResponse: UserResponse = {
      ...user,
    };

    return userResponse;
  }
}
