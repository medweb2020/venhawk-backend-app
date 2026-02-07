import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsService } from './vendors.service';
import { Vendor } from './entities/vendor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor])],
  providers: [VendorsService],
  exports: [VendorsService],
})
export class VendorsModule {}
