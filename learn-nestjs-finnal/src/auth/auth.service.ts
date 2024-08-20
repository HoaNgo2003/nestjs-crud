import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import ms from 'ms';
import { RegisterUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/schemas/user.schema';
import { IUser } from 'src/user/user.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService,
    private jwtService: JwtService,
    private configService:ConfigService,
    @InjectModel(User.name) private userModel: Model<User>
  ){}
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if(user){
      const isValid = this.usersService.checkUserPassword(pass, user.password)
      if(isValid ===true){
        return user
      }
    }
    return null;
  }
  async login(user: IUser, res: Response) {
    const {_id, name, email, role} = user
    const payload = {
      sub: 'token login',
      iss:'server',
      _id,
      name,
      email,
      role
    };
    const refresh_token = this.createRefreshRoken(payload)
    await this.usersService.updateUserToken(refresh_token, _id)
    res.cookie('refresh_token',refresh_token,{
      maxAge:ms(this.configService.get<string>("JWT_REFRESH_EXPIRES")),
      httpOnly: true
    })
    return {
      access_token: this.jwtService.sign(payload),
      user:{
        _id,
      name,
      email,
      }
      
    };
  }
  createRefreshRoken = (payload)=>{
    const refresh_token = this.jwtService.sign(payload,{
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      expiresIn:  ms(this.configService.get<string>("JWT_REFRESH_EXPIRES"))/1000
    })
    return refresh_token
  }
  async account(user: User){
    return {
      "user": user
    }
  }
  async processNewToken(refreshToken: string, res: Response){
    
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      })
      const user:any = await this.usersService.findUserByToken(refreshToken)
      console.log(user)
      if(!user){
        throw new BadRequestException('User not found')
      }
      const {_id, name, email, role} = user
    const payload = {
      sub: 'token login',
      iss:'server',
      _id,
      name,
      email,
      role
    };
    const refresh_token = this.createRefreshRoken(payload)
    await this.usersService.updateUserToken(refresh_token, _id)
    res.clearCookie('refresh_token')
    res.cookie('refresh_token',refresh_token,{
      maxAge:ms(this.configService.get<string>("JWT_REFRESH_EXPIRES")),
      httpOnly: true
    })
    return {
      access_token: this.jwtService.sign(payload),
      user:{
        _id,
      name,
      email,
      }
      
    };
    } catch (error) {
      throw new HttpException('Refresh token invalid, try login again', HttpStatus.BAD_REQUEST)
    }
  }
  async logout(res: Response, user: IUser){
    try {
      await this.userModel.updateOne({_id: user._id},{refreshToken: null})
    res.clearCookie('refresh_token')
      return {
        message: "logout success"
      }
    } catch (error) {
    throw new BadRequestException('Token invalid')  
    }

  }
}
