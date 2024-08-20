import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './passport/jwt.strategy';
import { AuthController } from './auth.controller';
import ms from 'ms';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';


@Module({
  imports:[
    UserModule,  
    PassportModule,
    JwtModule.register({
      secret: "afgljwagfliqw",
      signOptions: { expiresIn: ms('60s')/1000 },
    }),
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports:[AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
