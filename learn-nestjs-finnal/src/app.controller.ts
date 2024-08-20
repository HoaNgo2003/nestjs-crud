import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

import { AuthService } from './auth/auth.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private authService: AuthService
  ) {}

  @Get()
  @Render('home')
  getHello() {
    // return this.appService.getHello();
  }
  
  
}
