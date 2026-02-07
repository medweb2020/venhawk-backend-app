import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity('project_files')
export class ProjectFile {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  project_id: number;

  @Column({ type: 'varchar', length: 2048, comment: 'Supabase storage URL' })
  file_url: string;

  @Column({ type: 'varchar', length: 500, comment: 'Original filename' })
  file_name: string;

  @Column({ type: 'bigint', comment: 'File size in bytes' })
  file_size: number;

  @Column({ type: 'varchar', length: 255, comment: 'MIME type of the file' })
  mime_type: string;

  @CreateDateColumn({ type: 'timestamp' })
  uploaded_at: Date;

  @Column({ type: 'timestamp', nullable: true, default: null, comment: 'Soft delete timestamp' })
  deleted_at: Date | null;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
