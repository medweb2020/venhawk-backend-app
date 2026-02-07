import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ClientIndustry } from './client-industry.entity';
import { ProjectCategory } from './project-category.entity';

@Entity('projects')
@Index('idx_user_status', ['user_id', 'status'])
@Index('idx_submitted_at', ['submitted_at'])
@Index('idx_deleted_at', ['deleted_at'])
export class Project {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, nullable: false, comment: 'Foreign key to users.id' })
  user_id: number;

  @Column({ type: 'varchar', length: 500, nullable: false })
  project_title: string;

  @Column({ type: 'varchar', length: 180, nullable: false, comment: 'System name for the project' })
  system_name: string;

  @Column({ type: 'int', nullable: false })
  client_industry_id: number;

  @Column({ type: 'int', nullable: false })
  project_category_id: number;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: 'Custom category when category is Other' })
  project_category_custom: string;

  @Column({ type: 'text', nullable: false })
  project_objective: string;

  @Column({ type: 'text', nullable: false })
  business_requirements: string;

  @Column({ type: 'text', nullable: true })
  technical_requirements: string;

  @Column({ type: 'date', nullable: false })
  start_date: string;

  @Column({ type: 'date', nullable: true })
  end_date: string;

  @Column({ type: 'boolean', default: false })
  flexible_dates: boolean;

  @Column({ type: 'enum', enum: ['single', 'range'], nullable: false })
  budget_type: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: 'Used when budget_type = single' })
  budget_amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: 'Used when budget_type = range' })
  budget_min: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: 'Used when budget_type = range' })
  budget_max: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  budget_currency: string;

  @Column({ type: 'enum', enum: ['draft', 'submitted', 'in_review', 'approved', 'rejected', 'completed'], default: 'draft' })
  status: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  submitted_at: Date;

  @Column({ type: 'timestamp', nullable: true, comment: 'Soft delete' })
  deleted_at: Date;

  // Relations
  @ManyToOne(() => User, user => user.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ClientIndustry, clientIndustry => clientIndustry.projects)
  @JoinColumn({ name: 'client_industry_id' })
  clientIndustry: ClientIndustry;

  @ManyToOne(() => ProjectCategory, projectCategory => projectCategory.projects)
  @JoinColumn({ name: 'project_category_id' })
  projectCategory: ProjectCategory;
}
