import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';

@Entity('project_vendor_reasons')
@Index('uq_project_vendor_reasons_project_vendor', ['project_id', 'vendor_id'], {
  unique: true,
})
@Index('idx_project_vendor_reasons_project_updated', ['project_id', 'updated_at'])
export class ProjectVendorReason {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  project_id: number;

  @Column({ type: 'int' })
  vendor_id: number;

  @Column({ type: 'varchar', length: 420 })
  reason_text: string;

  @Column({ type: 'varchar', length: 16, default: 'fallback' })
  reason_source: 'openai' | 'fallback';

  @Column({ type: 'char', length: 40 })
  context_hash: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  model: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  computed_at: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Vendor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;
}
