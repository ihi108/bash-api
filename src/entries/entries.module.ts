import { Module } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entry } from './entities/entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entry])],
  controllers: [],
  providers: [EntriesService],
  exports: []
})
export class EntriesModule {}
