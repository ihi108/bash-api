import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Check } from "typeorm";
import { Base } from "../../base.entities/base";
import { Account } from "../../accounts/entities/account.entity";

@Entity("transfers")
@Check(`"amount" > 0.0`)
export class Transfer extends Base {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: string

    @Column("bigint")
    from_account_id: string

    @Column("bigint")
    to_account_id: string

    @Column("numeric", {comment: "can only be positive" })
    amount: number

    @ManyToOne(() => Account, (account) => account.to_transfers)
    @JoinColumn({name: "from_account_id"})
    from_account: Account
    
    @ManyToOne(() => Account, (account) => account.from_transfers)
    @JoinColumn({name: "to_account_id"})
    to_account: Account
}
