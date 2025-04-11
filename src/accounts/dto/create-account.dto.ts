import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateAccountDto {
    
    @IsNotEmpty()
    @IsString()
    owner: string

    @IsNumber()
    balance: string
}
