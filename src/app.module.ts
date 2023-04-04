import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import AuthModule from './modules/auth/auth.module';
import ProfileModule from './modules/profile/profile.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGODB_URL, {dbName: 'youapp_test'}), AuthModule, ProfileModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
