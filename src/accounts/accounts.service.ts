import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account = this.accountRepository.create(createAccountDto)
    return this.accountRepository.save(account)
  }

  findAll(): Promise<Account[]> {
    return this.accountRepository.find();
  }

  findOne(id: number) {
    return this.accountRepository.findOneBy({ id });
  }

}
