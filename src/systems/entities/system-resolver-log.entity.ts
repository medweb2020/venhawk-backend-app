import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { System } from './system.entity';

export interface ResolverCandidate {
  id: number;
  canonicalName: string;
  confidence: number;
}

@Entity('system_resolver_log')
@Index('idx_srl_input', ['input'])
@Index('idx_srl_tier', ['tier'])
@Index('idx_srl_resolved', ['resolved_system_id'])
@Index('idx_srl_created_at', ['created_at'])
export class SystemResolverLog {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 500, nullable: false })
  input: string;

  @Column({ type: 'tinyint', nullable: false, comment: '1=exact 2=alias 3=fuzzy 4=llm 5=unresolved' })
  tier: number;

  @Column({ type: 'int', nullable: true })
  resolved_system_id: number | null;

  @Column({ type: 'decimal', precision: 4, scale: 3, nullable: true })
  confidence: number | null;

  @Column({ type: 'json', nullable: true })
  candidates_json: ResolverCandidate[] | null;

  @Column({ type: 'text', nullable: true })
  llm_reasoning: string | null;

  @Column({ type: 'tinyint', width: 1, default: 0, nullable: false })
  cached: boolean;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => System, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'resolved_system_id' })
  resolved_system: System | null;
}
