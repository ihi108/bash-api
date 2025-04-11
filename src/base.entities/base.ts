import { Entity, CreateDateColumn } from "typeorm";


@Entity()
export class Base {
    @CreateDateColumn({ 
        type: "timestamptz",
    })
    created_at: Date
}