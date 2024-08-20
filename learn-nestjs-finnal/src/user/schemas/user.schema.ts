import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true})
export class User {
  @Prop({required: true})
  email: string;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop({required: true})
  password: string;

  @Prop()
  age: number;

  @Prop()
  gender: string

  @Prop()
  address: string
  @Prop({type: Object})
  company: {
    _id: mongoose.Schema.Types.ObjectId
    name: string
  }
  @Prop({default:'USER'})
  role: string
  @Prop()
  refreshToken: string

  @Prop({type: Object})
  createdBy:{
    _id: mongoose.Schema.Types.ObjectId;
    email: string
  }
  @Prop({type: Object})
  updatedBy:{
    _id: mongoose.Schema.Types.ObjectId;
    email: string
  }
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDeleted: boolean

  @Prop()
  deletedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User);