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

@Entity('vendor_reviews')
@Index('idx_vendor_reviews_vendor_project_order', [
  'vendor_id',
  'project_category_id',
  'display_order',
])
@Index('idx_vendor_reviews_vendor_source', ['vendor_id', 'review_source'])
export class VendorReview {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'int', nullable: false })
  vendor_id: number;

  @Column({ type: 'int', nullable: true })
  project_category_id: number | null;

  @Column({ type: 'varchar', length: 120, nullable: false })
  reviewer_name: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  reviewer_role: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  headline: string | null;

  @Column({ type: 'text', nullable: false })
  review_text: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating: number | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  review_source: string | null;

  @Column({ type: 'varchar', length: 700, nullable: true })
  review_url: string | null;

  @Column({ type: 'date', nullable: true })
  published_at: string | null;

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
