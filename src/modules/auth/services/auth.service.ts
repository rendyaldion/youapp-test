import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/schemas/user.schema"
import { LoginRequestDTO } from "../dtos/request/login-request.dto";
import { RegisterRequestDTO } from "../dtos/request/register-request.dto";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly model: Model<UserDocument>,
        private jwtService: JwtService
    ) {}

    async login(LoginRequestDTO: LoginRequestDTO) {
        const { email, password } = LoginRequestDTO;
        const user = await this.model.findOne({ email });
        if (!user) {
            throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
        }
        if (await bcrypt.compare(password, user.password)) {
            const payload = { username: user.username, sub: user._id };

            return {
                "success": true,
                "email": user.email,
                access_token: await this.jwtService.signAsync(payload),
            }
        } else {
            throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
        }
    }

    async create(RegisterRequestDTO: RegisterRequestDTO) {
        const { email } = RegisterRequestDTO;
        const user = await this.model.findOne({ email });
        if (user) {
          throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
        }
    
        const createdUser = new this.model(RegisterRequestDTO);
        await createdUser.save();
        
        return {
            "success": true,
            email,
        }
    }
}