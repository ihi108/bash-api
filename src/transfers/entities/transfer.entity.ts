import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Base } from "../../base.entities/base";
import { Account } from "../../accounts/entities/account.entity";

@Entity("transfers")
export class Transfer extends Base {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    from_account_id: number

    @Column()
    to_account_id: number

    @Column({ comment: "can only be positive" })
    amount: number

    @ManyToOne(() => Account, (account) => account.to_transfers)
    @JoinColumn({name: "from_account_id"})
    from_account: Account
    
    @ManyToOne(() => Account, (account) => account.from_transfers)
    @JoinColumn({name: "to_account_id"})
    to_account: Account
}
