import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateEntryDto {
    @IsNumber()
    @IsNotEmpty()
    amount: string

    @IsNumber()
    @IsNotEmpty()
    account_id: string
}
