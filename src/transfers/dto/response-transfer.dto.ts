import { Transfer } from "../entities/transfer.entity"
import { Account } from "../../accounts/entities/account.entity"
import { Entry } from "../../entries/entities/entry.entity"

export class responseTransferDto {
    transfer: Transfer
    from_account: Account
    to_account: Account
    from_entry: Entry    
    to_entry: Entry    
}
