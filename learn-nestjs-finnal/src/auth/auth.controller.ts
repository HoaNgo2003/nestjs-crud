import { Body, Controller, Get, Post, Req,  Res, UseGuards } from '@nestjs/common';
import { RegisterUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { Public } from '../decorator/customize';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { ResponseMessage } from 'src/decorator/response.message.decorator';
import {   Request, Response } from 'express';
import { User } from 'src/decorator/user.decorator';
import { IUser } from 'src/user/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
    private userService: UserService
  ){}
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('User login')
  @Post("/login")
  handleLogin(@Req() req, @Res({passthrough: true}) res: Response){
    return this.authService.login(req.user, res)
  }
  @Public()
  @Post("register")
  registerUser(@Body() userDtoResgiter: RegisterUserDto){
    return this.userService.create(userDtoResgiter)
  }
  @ResponseMessage("get user information")
  @Get('account')
  getAccount(@User() user){
    return this.authService.account(user)
  }
  @Public()
  @Get('refresh-token')
  handleRefreshToken(@Req() req: Request,@Res({passthrough: true}) res: Response){
    const refreshToken = req.cookies['refresh_token']
    
    return this.authService.processNewToken(refreshToken, res)
  }
  @Post('logout')
  handleLogout(@Res({passthrough: true}) res: Response, @User() user:IUser){
    return this.authService.logout(res, user)
  }

}
