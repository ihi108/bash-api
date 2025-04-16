import { TestingModule } from '@nestjs/testing';
import { TransfersService } from './transfers.service';
import { AccountsModule } from '../accounts/accounts.module';
import { Transfer } from './entities/transfer.entity';
import { Account } from '../accounts/entities/account.entity';
import { Entry } from '../entries/entities/entry.entity';
import { createTestModule } from '../../test/test_service_util';

describe('TransfersService', () => {
  let service: TransfersService;
  let module: TestingModule

  beforeEach(async () => {
    module = await createTestModule({
      entities: [Transfer, Account, Entry],
      providers: [TransfersService],
      imports: [AccountsModule]
    })

    service = module.get<TransfersService>(TransfersService);
  });

  afterAll(async () => {
    await module.close()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
