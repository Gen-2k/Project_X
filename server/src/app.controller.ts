import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // GET route: http://localhost:3000/users
  @Get('users')
  getUsers() {
    return this.appService.getUsers();
  }

  // POST route to test adding a user
  @Post('users')
  createUser(@Body() body: { email: string; name?: string }) {
    return this.appService.createUser(body.email, body.name);
  }
}
