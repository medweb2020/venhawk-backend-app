import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('project_categories')
export class ProjectCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  value: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  label: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Project, (project) => project.projectCategory)
  projects: Project[];
}
