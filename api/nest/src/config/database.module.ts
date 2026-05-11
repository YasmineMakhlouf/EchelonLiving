import { Global, Module } from '@nestjs/common';
import { PG_POOL, pool } from './database.provider';

@Global()
@Module({
  providers: [{ provide: PG_POOL, useValue: pool }],
  exports: [PG_POOL],
})
export class DatabaseModule {}
