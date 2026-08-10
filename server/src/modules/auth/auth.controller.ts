import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Request, Response } from 'express';

import { AuthService } from './auth.service';
import { AuthResponseDto, LogoutResponseDto, UserDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private getCookieOptions(): CookieOptions {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    if (!nodeEnv) {
      throw new Error('NODE_ENV environment variable is not defined in .env');
    }
    return {
      httpOnly: true,
      secure: nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };
  }

  private setJwtCookie(response: Response, token: string): void {
    response.cookie('jwt', token, this.getCookieOptions());
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.register(registerDto);
    this.setJwtCookie(response, result.access_token);
    return { user: result.user, message: 'Registration successful' };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.login(loginDto);
    this.setJwtCookie(response, result.access_token);
    return { user: result.user, message: 'Login successful' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response): LogoutResponseDto {
    response.clearCookie('jwt', this.getCookieOptions());
    return { message: 'Logout successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request): Promise<UserDto> {
    const reqUser = req.user as { id: string };
    return this.authService.getProfile(reqUser.id);
  }
}
