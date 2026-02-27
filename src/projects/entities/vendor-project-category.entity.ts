import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { ProjectCategory } from './project-category.entity';

@Entity('vendor_project_categories')
@Unique('uq_vendor_project_categories_vendor_category', [
  'vendor_id',
  'project_category_id',
])
@Index('idx_vendor_project_categories_category_vendor', [
  'project_category_id',
  'vendor_id',
])
@Index('idx_vendor_project_categories_vendor', ['vendor_id'])
export class VendorProjectCategory {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', nullable: false })
  vendor_id: number;

  @Column({ type: 'int', nullable: false })
  project_category_id: number;

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

  @ManyToOne(() => ProjectCategory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_category_id' })
  projectCategory: ProjectCategory;
}
