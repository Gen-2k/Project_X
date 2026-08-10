import { UsersService } from '@modules/users/users.service';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto, UserDto } from '@project/shared';

import { PasswordService } from './password.service';

export interface AuthResponse {
  access_token: string;
  user: UserDto;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.usersService.findOne(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await this.passwordService.hashPassword(registerDto.password);

    const user = await this.usersService.create({
      email: registerDto.email,
      name: registerDto.name,
      passwordHash,
    });

    return this.generateAuthResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findOne(loginDto.email);
    if (!user) {
      await this.passwordService.mitigateTimingAttack(loginDto.password); // mitigate timing attack
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await this.passwordService.comparePassword(
      loginDto.password,
      user.passwordHash,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAuthResponse(user);
  }

  async getProfile(userId: string): Promise<UserDto> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  private generateAuthResponse(user: {
    id: string;
    email: string;
    name: string | null;
  }): AuthResponse {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
