import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Base } from "../../base.entities/base";
import { Account } from "../../accounts/entities/account.entity";

@Entity("entries")
export class Entry extends Base {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: string

    @Column({ 
        type: "numeric", 
        comment: "can be negative or positive" 
    })
    amount: number

    @Column("bigint")
    account_id: string

    @ManyToOne(() => Account, (account) => account.entries)
    @JoinColumn({name: "account_id"})
    account: Account
}
