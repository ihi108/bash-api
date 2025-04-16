// test-utils.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

export interface TestModuleOptions {
  entities: any[];
  imports?: any[];
  providers?: any[];
  controllers?: any[];
}

export async function createTestModule({
  entities,
  imports = [],
  providers = [],
  controllers = [],
}: TestModuleOptions): Promise<TestingModule> {
  return await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'root',
        password: 'password',
        database: 'bash',
        synchronize: true,
        entities,
      }),
      ...imports,
    ],
    providers,
    controllers,
  }).compile();
}
