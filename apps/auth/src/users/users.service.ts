import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  private async validateCreateUserDto({ email }: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email });
    } catch (error) {
      return false;
    }

    throw new UnprocessableEntityException('Email already exists');
  }

  async verifyUser(email: string, password) {
    let user;
    try {
      user = await this.usersRepository.findOne({ email });
    } catch {
      throw new NotFoundException('User does not exist');
    }
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }
}
