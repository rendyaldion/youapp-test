import { Body, Controller, Param, Post, Get, Put, UseGuards, Request, UseInterceptors, UploadedFile } from "@nestjs/common";
import { ProfileService } from "../../services/profile.service";
import { ProfileRequestDTO } from "../../dtos/request/profile-request.dto";
import { AuthGuard } from "src/guards/auth.guards";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller()
export class ProfileController {
    constructor(private profileService: ProfileService) {}

    @UseGuards(AuthGuard)
    @Post('/createProfile')
    @UseInterceptors(FileInterceptor('image'))
    async create(@Body() ProfileRequestDTO: ProfileRequestDTO, @Request() req, @UploadedFile() image: Express.Multer.File) {
        return this.profileService.create(ProfileRequestDTO, req.user.sub, image);
    }

    @UseGuards(AuthGuard)
    @Get("/getProfile")
    async get(@Request() req) {
        return this.profileService.getById(req.user.sub)
    }

    @UseGuards(AuthGuard)
    @Put("/updateProfile")
    async update(@Body() ProfileRequestDTO: ProfileRequestDTO, @Request() req) {
        return this.profileService.update(ProfileRequestDTO, req.user.sub);
    }
}