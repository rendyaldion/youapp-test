import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileSchema } from 'src/schemas/profile.schema';
import { ProfileService } from './services/profile.service';
import { ProfileController } from './infra/http/profile.controller';
import { UserSchema } from 'src/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema}, { name: 'User', schema: UserSchema}]), JwtModule.register({
        secret: 'secret key',
        signOptions: { expiresIn: '10h' },
    })],
    controllers: [ProfileController],
    providers: [ProfileService],
})

export default class ProfileModule {}