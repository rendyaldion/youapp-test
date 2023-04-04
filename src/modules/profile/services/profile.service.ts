import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Profile, ProfileDocument } from "src/schemas/profile.schema"
import { User, UserDocument } from "src/schemas/user.schema"
import { ProfileRequestDTO } from "../dtos/request/profile-request.dto";

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(Profile.name) private readonly profileModel: Model<ProfileDocument>,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) {}

    async create(ProfileRequestDTO: ProfileRequestDTO, userId: string) {
        const user = await this.userModel.findById({ _id: userId });
        if (!user) {
          throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
        }

        ProfileRequestDTO.userId = userId
    
        const createProfile = new this.profileModel(ProfileRequestDTO);
        await createProfile.save();

        return {
            success: true,
            data: ProfileRequestDTO,
        }
    }

    async getById(userId: string) {
        const user = await this.profileModel.findOne({ userId: userId });

        return {
            success: true,
            data: user
        }
    }

    async update(ProfileRequestDTO: ProfileRequestDTO, userId: string) {
        const user = await this.profileModel.updateOne({userId: userId}, ProfileRequestDTO);
        
        let success = true
        if (user.modifiedCount < 1) {
            success = false
        }
        
        return {
            success: success
        }
    }
}