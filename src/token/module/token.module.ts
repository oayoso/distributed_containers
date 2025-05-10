import { Module } from '@nestjs/common';
import { TokenController } from '../controller/token.controller';

@Module({
  controllers: [TokenController],
  providers: []
})
export class TokenModule {}
