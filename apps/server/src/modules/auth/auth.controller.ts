import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import {
  AuthResponseDto,
  LoginDto,
  LogoutResponseDto,
  RegisterDto,
  UserDto,
} from '@project/shared';
import type { CookieOptions, Request, Response } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
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
    // COOKIE_SECURE overrides the NODE_ENV default, so a plain-HTTP
    // deployment (e.g. dockerized NODE_ENV=production on port 80) can
    // still set cookies that browsers will accept.
    const cookieSecure = this.configService.get<string>('COOKIE_SECURE');
    const secure = cookieSecure !== undefined ? cookieSecure === 'true' : nodeEnv === 'production';
    return {
      httpOnly: true,
      secure,
      sameSite: 'strict',
      maxAge: this.cookieMaxAgeMs(),
    };
  }

  // Keep the cookie lifetime in sync with the JWT, so the httpOnly cookie
  // does not outlive (or expire before) the token it carries.
  private cookieMaxAgeMs(): number {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') ?? '1d';
    const [, amount, unit] = /^(\d+)\s*(ms|s|m|h|d|w)$/.exec(expiresIn.trim()) ?? [];
    if (!amount || !unit) {
      return 24 * 60 * 60 * 1000; // fall back to 1 day for unparseable values
    }
    const unitMs: Record<string, number> = {
      ms: 1,
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
      w: 7 * 24 * 60 * 60 * 1000,
    };
    return Number(amount) * unitMs[unit]!;
  }

  private setJwtCookie(response: Response, token: string): void {
    response.cookie('jwt', token, this.getCookieOptions());
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User successfully registered' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already registered' })
  @ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Rate limit exceeded' })
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.register(registerDto);
    this.setJwtCookie(response, result.access_token);
    return { user: result.user, message: 'Registration successful' };
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate with email and password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful, JWT set in cookie' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  @ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Rate limit exceeded' })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.login(loginDto);
    this.setJwtCookie(response, result.access_token);
    return { user: result.user, message: 'Login successful' };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log out and clear session cookie' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Logout successful' })
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response): LogoutResponseDto {
    response.clearCookie('jwt', this.getCookieOptions());
    return { message: 'Logout successful' };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get profile of current authenticated user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Authenticated user profile' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized or invalid token' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request): Promise<UserDto> {
    const reqUser = req.user as { id: string };
    return this.authService.getProfile(reqUser.id);
  }
}
