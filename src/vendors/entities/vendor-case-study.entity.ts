import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Vendor } from './vendor.entity';
import { ProjectCategory } from '../../projects/entities/project-category.entity';

@Entity('vendor_case_studies')
@Index('idx_vendor_case_studies_vendor_project_order', [
  'vendor_id',
  'project_category_id',
  'display_order',
])
@Index('idx_vendor_case_studies_vendor_project_title', [
  'vendor_id',
  'project_category_id',
  'title',
])
export class VendorCaseStudy {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'int', nullable: false })
  vendor_id: number;

  @Column({ type: 'int', nullable: true })
  project_category_id: number | null;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  summary: string;

  @Column({ type: 'varchar', length: 700, nullable: true })
  study_url: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  source_name: string | null;

  @Column({ type: 'varchar', length: 700, nullable: true })
  source_url: string | null;

  @Column({ type: 'int', default: 0 })
  display_order: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => Vendor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @ManyToOne(() => ProjectCategory, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'project_category_id' })
  projectCategory: ProjectCategory | null;
}
