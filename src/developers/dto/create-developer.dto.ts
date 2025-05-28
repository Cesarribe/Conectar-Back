import { IsDateString, IsString } from "class-validator";

export class CreateDeveloperDto {

    @IsString()
    name: String;

    @IsString()
    email: String;

    @IsDateString()
    dateOfBrith: String;
}
