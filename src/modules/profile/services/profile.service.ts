import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Profile, ProfileDocument } from "src/schemas/profile.schema"
import { User, UserDocument } from "src/schemas/user.schema"
import { ProfileRequestDTO } from "../dtos/request/profile-request.dto";
import { CloudinaryService } from "src/modules/cloudinary/cloudinary.service";

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(Profile.name) private readonly profileModel: Model<ProfileDocument>,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private cloudinary :CloudinaryService,
    ) {}

    async create(ProfileRequestDTO: ProfileRequestDTO, userId: string, image: Express.Multer.File) {
        const user = await this.userModel.findById({ _id: userId });
        if (!user) {
          throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
        }

        const checkProfile = await this.profileModel.findOne({ userId: userId })
        if (checkProfile) {
            throw new HttpException('user already has profile', HttpStatus.BAD_REQUEST);
        }

        const uploadImage = await this.cloudinary.uploadImage(image).catch(() => {
            throw new HttpException('error when try to upload image', HttpStatus.BAD_REQUEST);
        });

        ProfileRequestDTO.displayName = uploadImage.secure_url
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

    async update(ProfileRequestDTO: ProfileRequestDTO, userId: string, image: Express.Multer.File) {
        const user = await this.userModel.findById({ _id: userId });
        if (!user) {
          throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
        }

        const update = await this.profileModel.updateOne({userId: userId}, ProfileRequestDTO);

        if (image != undefined) {
            const uploadImage = await this.cloudinary.uploadImage(image).catch(() => {
                throw new HttpException('error when try to upload image', HttpStatus.BAD_REQUEST);
            });

            ProfileRequestDTO.displayName = uploadImage.secure_url
        }
        
        let success = true
        if (update.modifiedCount < 1) {
            success = false
        }
        
        return {
            success: success
        }
    }
}