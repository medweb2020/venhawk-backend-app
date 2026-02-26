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

@Entity('project_vendor_matches')
@Index('uq_project_vendor_matches_project_vendor', ['project_id', 'vendor_id'], {
  unique: true,
})
@Index('idx_project_vendor_matches_project_rank', ['project_id', 'rank_position'])
@Index('idx_project_vendor_matches_computed_at', ['computed_at'])
export class ProjectVendorMatch {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  project_id: number;

  @Column({ type: 'int' })
  vendor_id: number;

  @Column({ type: 'int' })
  rank_position: number;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  raw_score: number;

  @Column({ type: 'int' })
  display_score: number;

  @Column({ type: 'json', nullable: true })
  score_breakdown_json: Record<string, unknown> | null;

  @Column({ type: 'varchar', length: 32, default: 'v1' })
  scoring_version: string;

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
