import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateEntryDto {
    @IsNotEmpty()
    @IsNumber()
    amount: number

    @IsNotEmpty()
    @IsNumber()
    account_id: string
}
