import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { Transfer } from './entities/transfer.entity';
import { DataSource} from 'typeorm';
import { Entry } from '../entries/entities/entry.entity';
import { responseTransferDto } from './dto/response-transfer.dto';
import { Account } from '../accounts/entities/account.entity';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class TransfersService {
  constructor(
    private dataSource: DataSource,
  ) {}

  async create(createTransferDto: CreateTransferDto): Promise<responseTransferDto> {
    const retries:number = 5;
    let res: responseTransferDto;

    for (let attempts = 0; attempts < retries; attempts++) {
      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction("SERIALIZABLE")

      try {
        const fromEntry: Entry = new Entry()
        fromEntry.amount = - createTransferDto.amount;
        fromEntry.account_id = String(createTransferDto.from_account_id);

        const toEntry: Entry = new Entry()
        toEntry.amount = createTransferDto.amount;
        toEntry.account_id = String(createTransferDto.to_account_id);


        const fromAccount = await queryRunner.manager.findOne(Account, {
          where: {
            id: createTransferDto.from_account_id
          },
        });
        if (!fromAccount) {
          throw new NotFoundException(`account with id: ${createTransferDto.from_account_id} not found`)
        }
        if (fromAccount.balance < createTransferDto.amount) {
          throw new ForbiddenException(`fromAccount has insufficient funds`);
        }
        fromAccount.balance = Number(fromAccount.balance) - Number(createTransferDto.amount);

        const toAccount = await queryRunner.manager.findOne(Account, {
          where: {
            id: createTransferDto.to_account_id
          },
        });
        if (!toAccount) {
          throw new NotFoundException(`account with id: ${createTransferDto.from_account_id} not found`)
        }
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

        break;
      } catch (error) {
        await queryRunner.rollbackTransaction()
        if (error.code == 40001 && attempts < retries - 1) {
          await new Promise(res => setTimeout(res, 100 * (attempts + 1)));
        } else {
          throw error
        }
      } finally {
        await queryRunner.release()
      }
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
