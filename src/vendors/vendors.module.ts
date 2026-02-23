import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsService } from './vendors.service';
import { Vendor } from './entities/vendor.entity';
import { VendorsController } from './vendors.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor])],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [VendorsService],
})
export class VendorsModule {}
