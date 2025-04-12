import { Injectable } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transfer } from './entities/transfer.entity';
import { DataSource, Repository } from 'typeorm';
import { Entry } from '../entries/entities/entry.entity';
import { responseTransferDto } from './dto/response-transfer.dto';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class TransfersService {
  constructor(
    @InjectRepository(Transfer) private transferRepository: Repository<Transfer>,
    private dataSource: DataSource,
    private accountService: AccountsService
  ) {}

  async create(createTransferDto: CreateTransferDto): Promise<responseTransferDto> {

    let res: responseTransferDto;

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const fromEntry: Entry = new Entry()
      fromEntry.amount = - createTransferDto.amount;
      fromEntry.account_id = String(createTransferDto.from_account_id);

      const toEntry: Entry = new Entry()
      toEntry.amount = createTransferDto.amount;
      toEntry.account_id = String(createTransferDto.to_account_id);


      const fromAccount = await this.accountService.findOne(createTransferDto.from_account_id);
      fromAccount.balance = Number(fromAccount.balance) - Number(createTransferDto.amount);

      const toAccount = await this.accountService.findOne(createTransferDto.to_account_id);
      toAccount.balance = Number(toAccount.balance) + Number(createTransferDto.amount);


      const transfer = new Transfer()
      transfer.from_account_id = createTransferDto.from_account_id;
      transfer.to_account_id = createTransferDto.to_account_id;
      transfer.amount = createTransferDto.amount;

      await queryRunner.manager.save(fromEntry)
      await queryRunner.manager.save(toEntry)
      await queryRunner.manager.save(fromAccount)
      await queryRunner.manager.save(toAccount)
      await queryRunner.manager.save(transfer)

      await queryRunner.commitTransaction()

      res = {
        from_account: fromAccount,
        to_account: toAccount,
        from_entry: fromEntry,
        to_entry: toEntry,
        transfer: transfer
      }
    } catch (error) {
      console.log("Error: ", error)
      await queryRunner.rollbackTransaction()
    } finally {
      await queryRunner.release()
    }

    

    return res

  }

  findAll() {
    return `This action returns all transfers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transfer`;
  }

  update(id: number, updateTransferDto: UpdateTransferDto) {
    return `This action updates a #${id} transfer`;
  }

  remove(id: number) {
    return `This action removes a #${id} transfer`;
  }
}
