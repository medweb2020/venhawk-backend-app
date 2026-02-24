import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('client_industries')
export class ClientIndustry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  value: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  label: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Project, (project) => project.clientIndustry)
  projects: Project[];
}
