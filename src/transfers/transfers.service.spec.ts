import { TestingModule } from '@nestjs/testing';
import { TransfersService } from './transfers.service';
import { AccountsModule } from '../accounts/accounts.module';
import { Transfer } from './entities/transfer.entity';
import { Account } from '../accounts/entities/account.entity';
import { Entry } from '../entries/entities/entry.entity';
import { createTestModule } from '../../test/test_service_util';
import { AccountsService } from '../accounts/accounts.service';
import { UtilsModule } from '../utils/utils.module';
import { UtilsService } from '../utils/utils.service';
import { CreateAccountDto } from '../accounts/dto/create-account.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { responseTransferDto } from './dto/response-transfer.dto';
import { DataSource } from 'typeorm';

describe('TransfersService', () => {
  let service: TransfersService;
  let module: TestingModule;
  let accountsService: AccountsService;
  let utilsService: UtilsService;

  let from_account: Account
  let to_account: Account

  let amount: number

  beforeEach(async () => {
    module = await createTestModule({
      entities: [Transfer, Account, Entry],
      providers: [TransfersService],
      imports: [AccountsModule, UtilsModule],
    })

    service = await module.get<TransfersService>(TransfersService);
    accountsService = await module.get<AccountsService>(AccountsService)
    utilsService = await module.get<UtilsService>(UtilsService)


    let from_account_obj: CreateAccountDto = {
      owner: utilsService.randomString(7),
      balance: utilsService.constantBalance(),
    }

    let to_account_obj: CreateAccountDto = {
      owner: utilsService.randomString(7),
      balance: utilsService.constantBalance(),
    }

    from_account = await accountsService.create(from_account_obj)
    to_account = await accountsService.create(to_account_obj)

    amount = 25.75;

  });
 
  it('should be defined', async () => {
    expect(service).toBeDefined();
    expect(accountsService).toBeDefined();
    expect(utilsService).toBeDefined();
  });

  it('should create two accounts and process a transaction', async () => {
    let transfer: responseTransferDto;


    let transferObj: CreateTransferDto = {
      from_account_id: from_account.id,
      to_account_id: to_account.id,
      amount,
    }

    transfer = await service.create(transferObj)

    expect(transfer).toBeDefined()
    expect(transfer.from_account).toBeInstanceOf(Account);
    expect(transfer.to_account).toBeInstanceOf(Account);
    expect(transfer.from_entry).toBeInstanceOf(Entry)
    expect(transfer.to_entry).toBeInstanceOf(Entry)
    expect(transfer.transfer).toBeInstanceOf(Transfer)

    expect(transfer.from_account.id).toEqual(from_account.id)
    expect(transfer.to_account.id).toEqual(to_account.id)
  });

  it('should create multiple accounts and process multiple transactions', async () => {
    interface accountPair {
      from_account: Account
      to_account: Account
    }
    let accountPairs: accountPair[] = [];
    let transactionPromises: Promise<responseTransferDto>[] = [];

    for (let i=0; i<5; i++) {
      let from_account_obj: CreateAccountDto = {
        owner: utilsService.randomString(7),
        balance: utilsService.constantBalance(),
      }
  
      let to_account_obj: CreateAccountDto = {
        owner: utilsService.randomString(7),
        balance: utilsService.constantBalance(),
      }
  
      from_account = await accountsService.create(from_account_obj)
      to_account = await accountsService.create(to_account_obj)

      let accounts: accountPair = {
        from_account,
        to_account,
      }

      accountPairs[i] = accounts;
    }

    for (let i=0; i<5; i++) {

      let transferObj: CreateTransferDto = {
        from_account_id: accountPairs[i].from_account.id,
        to_account_id: accountPairs[i].to_account.id,
        amount: 150,
      }
  
      transactionPromises[i] = service.create(transferObj)
    }

    return Promise.all(transactionPromises)
    .then((values) => {
      for (let i = 0; i < 5; i++) {
        let value = values[0]
        let from_account = accountPairs[0].from_account
        let to_account = accountPairs[0].to_account

        expect(value).toBeDefined();
        expect(from_account).toBeInstanceOf(Account);
        expect(to_account).toBeInstanceOf(Account);
        expect(from_account.id).toBe(value.from_account.id)
        expect(to_account.id).toBe(value.to_account.id)

        expect(value.to_account).toBeInstanceOf(Account);
        expect(value.from_account).toBeInstanceOf(Account);
        expect(value.from_entry).toBeInstanceOf(Entry)
        expect(value.to_entry).toBeInstanceOf(Entry)
        expect(value.transfer).toBeInstanceOf(Transfer)

        expect(from_account.balance - value.transfer.amount).toEqual(value.from_account.balance)
        expect(to_account.balance + value.transfer.amount).toEqual(value.to_account.balance)
      }
    })

  });


  afterEach(async () => {
    await module.close()
  })
});
