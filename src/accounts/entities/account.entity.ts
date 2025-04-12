import { Check, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Base } from "../../base.entities/base";
import { Entry } from "../../entries/entities/entry.entity";
import { Transfer } from "../../transfers/entities/transfer.entity";

@Entity("accounts")
export class Account extends Base {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: string

    @Column()
    owner: string

    @Column("numeric")
    balance: number

    @OneToMany(() => Entry, entry => entry.account)
    entries: Entry[]

    @OneToMany(() => Transfer, transfer => transfer.from_account)
    from_transfers: Transfer[]

    @OneToMany(() => Transfer, transfer => transfer.from_account_id || transfer.to_account)
    to_transfers: Transfer[]
}
