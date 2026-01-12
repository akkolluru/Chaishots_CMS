import { Module } from '@nestjs/common';
import { PrismaModule } from '../../modules/prisma/prisma.module';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AssetsController],
  providers: [AssetsService],
  exports: [AssetsService],
})
export class AssetsModule {}