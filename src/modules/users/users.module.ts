import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],   // 👈 VERY IMPORTANT
})
export class UsersModule {}