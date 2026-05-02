import { Controller, Post, Body, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import FormatValidation from "../helper/validation-formats";
import { CreateAuthDto } from "./dto/create-auth.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    @UsePipes(new ValidationPipe({ exceptionFactory: FormatValidation }))
    async auth(@Body() authDto: CreateAuthDto) {
        return this.authService.signIn(authDto.email, authDto.password);
    }
    
}