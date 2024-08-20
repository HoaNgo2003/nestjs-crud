import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
 
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { CompaniesModule } from './companies/companies.module';
import { JobsModule } from './jobs/jobs.module';

 
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:'.env',
      isGlobal: true
    }),
    // MongooseModule.forRoot('mongodb+srv://hoango:HoaNgo1610@cluster0.fs0fkqb.mongodb.net/nest-project'),
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: async (configService: ConfigService)=>({
        uri: configService.get<string>('MONGO_URL'),
        connectionFactory:(connection)=>{
          connection.plugin(softDeletePlugin);
          return connection
        }
      })
}),
    UserModule,
     
    AuthModule,
     
    CompaniesModule,
     
    JobsModule,
    

  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
})
export class AppModule {}
