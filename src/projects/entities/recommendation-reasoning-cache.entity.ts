import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';

@Entity('recommendation_reasoning_cache')
@Index('uq_project_vendor', ['project_id', 'vendor_id'], { unique: true })
@Index('idx_expires_at', ['expires_at'])
export class RecommendationReasoningCache {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  project_id: number;

  @Column({ type: 'int', unsigned: true })
  vendor_id: number;

  @Column({ type: 'text' })
  reasoning: string;

  @Column({ type: 'varchar', length: 50 })
  model_used: string;

  @Column({ type: 'int', unsigned: true })
  vendor_rank: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  generated_at: Date;

  @Column({ type: 'datetime' })
  expires_at: Date;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Vendor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;
}
