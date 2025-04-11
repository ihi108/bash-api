import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Base } from "../../base.entities/base";
import { Account } from "../../accounts/entities/account.entity";

@Entity("entries")
export class Entry extends Base {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: string

    @Column({ 
        type: "bigint", 
        comment: "can be negative or positive" 
    })
    amount: string

    @Column("bigint")
    account_id: string

    @ManyToOne(() => Account, (account) => account.entries)
    @JoinColumn({name: "account_id"})
    account: Account
}
