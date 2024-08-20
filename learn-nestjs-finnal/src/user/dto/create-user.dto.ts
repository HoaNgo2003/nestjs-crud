import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";
class Company{
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId

  @IsNotEmpty()
  name: string
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  age: number

  @IsNotEmpty()
  gender: string

  @IsNotEmpty()
  address: string

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(()=>Company)
  company: Company
}

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  age: number

  @IsNotEmpty()
  gender: string

  @IsNotEmpty()
  address: string

  
  role: string
}

// 11:14