import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { System } from './entities/system.entity';
import { SystemResolverLog } from './entities/system-resolver-log.entity';
import { SystemResolverService } from './services/system-resolver.service';
import { SystemsController } from './systems.controller';

@Module({
  imports: [TypeOrmModule.forFeature([System, SystemResolverLog])],
  controllers: [SystemsController],
  providers: [SystemResolverService],
  exports: [SystemResolverService],
})
export class SystemsModule {}
