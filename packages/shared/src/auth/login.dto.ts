import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';

import { MaxBcryptBytes } from './password.validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Validate(MaxBcryptBytes)
  password!: string;
}
