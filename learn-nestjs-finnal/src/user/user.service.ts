import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {  CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';

import { compareSync, genSaltSync, hashSync } from 'bcryptjs'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import aqp from 'api-query-params';
import { IUser } from './user.interface';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
private jwtService: JwtService){}
   getHasgPassword(password: string){
    const salt = genSaltSync(10);
    const hash =   hashSync(password, salt);
    return hash
  }
  async create(userDtoResgiter: RegisterUserDto) {
    try {
      userDtoResgiter.password = this.getHasgPassword(userDtoResgiter.password)
      const user = new this.userModel(userDtoResgiter)
      
    await user.save()
    return {
      
        "_id":user._id,
        "createAt":user.createdAt
     
    }
    } catch (error) {
      throw new HttpException("Bad request",HttpStatus.BAD_REQUEST)

    }
  }
  async register(userRegister: RegisterUserDto): Promise<any>{
    try {
      const user = new this.userModel(userRegister)
      await user.save()
      user.refreshToken = this.jwtService.sign({
        username: user.email,
        sub: user._id
      })
      await user.save()
    return {
       
      "message":"Register a new user",
        "_id":user._id,
        "createAt":user.createdAt,
        "refreshToken":user.refreshToken
      
    }
    } catch (error) {
      throw new HttpException("Bad request",HttpStatus.BAD_REQUEST)
    }
  }
  async createUser(userDto:CreateUserDto):Promise<User>{
    try {
      console.log(userDto.email)
      const isUserExit = await this.userModel.findOne({email: userDto.email})
      if(isUserExit){
        throw new HttpException('Email is already exit', HttpStatus.BAD_REQUEST)
      }
      const user = new this.userModel(userDto)
      await user.save()
      return  user
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY)
    }
  }
  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
   console.log(filter?.name)
    const offset = (currentPage-1)*limit
    const defaultLimit = limit ? limit : 10
    const totalUsers = (await this.userModel.find(filter)).length
    const totalPages = Math.ceil(totalUsers/defaultLimit)
     
    const result = await this.userModel.find(filter).select("-password")
    .skip(offset)
    .limit(defaultLimit)
    .populate(population)
    .exec()
    console.log(result)
    return {
      meta: {
        current: currentPage,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalUsers
      },
      result
    }
  }

  async findOne(id: string){
    try {
      if(!mongoose.Types.ObjectId.isValid(id)){
        return 'not found user'
      }
      const user = await this.userModel.findOne({
        _id: id
      }).lean();
      
     delete user.password
      
      return user
    } catch (error) {
      return 'not found user'
    }
   
  }
  async findOneByUsername(email: string):Promise<User>{
    try {
      
      return await this.userModel.findOne({
       email: email
      });
    } catch (error) {
      console.log(error)
    }
   
  }
  checkUserPassword(password: string, hashPassword){
    return compareSync(password, hashPassword);
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({_id:id},{...updateUserDto});
  }

  async remove(id: string) {
    return await this.userModel.softDelete({_id:id});
  }
  async updateUser(userDto:UpdateUserDto, id:string):Promise<any>{
    try {
      const user = await this.userModel.updateOne({_id: id},userDto)
      return {
        ...user
      }
    } catch (error) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
    }
  }
   updateUserToken = async (refreshToken:string, id:string)=>{
    try {
      return this.userModel.updateOne({_id: id}, {refreshToken} )
    } catch (error) {
      console.log(error)
    }
  }
  async findUserByToken(refreshToken: string){
    return await this.userModel.findOne({refreshToken})
  }
}
