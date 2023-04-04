import { Body, Controller, Param, Post, Get, Put, UseGuards, Request } from "@nestjs/common";
import { ProfileService } from "../../services/profile.service";
import { ProfileRequestDTO } from "../../dtos/request/profile-request.dto";
import { AuthGuard } from "src/guards/auth.guards";

@Controller()
export class ProfileController {
    constructor(private profileService: ProfileService) {}

    @UseGuards(AuthGuard)
    @Post('/createProfile')
    async create(@Body() ProfileRequestDTO: ProfileRequestDTO, @Request() req) {
        return this.profileService.create(ProfileRequestDTO, req.user.sub);
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