import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateTransferDto {
    
    @IsNotEmpty()
    @IsNumber()
    from_account_id: string

    @IsNotEmpty()
    @IsNumber()
    to_account_id: string

    @IsNotEmpty()
    @IsNumber()
    amount: number
}
