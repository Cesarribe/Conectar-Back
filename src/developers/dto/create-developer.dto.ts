import { IsDateString, IsString } from "class-validator";

export class CreateDeveloperDto {

    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsDateString()
    dateOfBirth: string;
}
