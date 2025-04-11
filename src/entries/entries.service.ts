import { Injectable } from '@nestjs/common';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Entry } from './entities/entry.entity';
import { Repository } from 'typeorm';
import { Account } from '../accounts/entities/account.entity';

@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(Entry)
    private entryRepository: Repository<Entry>
  ) {}

  create(createEntryDto: CreateEntryDto): Promise<Entry> {
    const entry = this.entryRepository.create(createEntryDto)
    return this.entryRepository.save(entry)
  }

  findAll() {
    return `This action returns all entries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} entry`;
  }

}
