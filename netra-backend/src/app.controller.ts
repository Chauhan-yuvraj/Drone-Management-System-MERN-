/* eslint-disable @typescript-eslint/no-unsafe-return */
// netra-backend/src/app.controller.ts

import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard'; // <-- Import the guard

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // This endpoint is public
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // This endpoint is protected by the JWT Guard
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return req.user;
  }
}
