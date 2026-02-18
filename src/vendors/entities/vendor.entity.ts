import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('vendors')
@Index('idx_brand_name', ['brand_name'])
@Index('idx_vendor_type', ['vendor_type'])
@Index('idx_status', ['status'])
@Index('idx_legal_focus', ['legal_focus_level'])
@Index('idx_budget', ['min_project_size_usd', 'max_project_size_usd'])
@Index('idx_ratings', ['rating_1', 'rating_2'])
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 36, unique: true, nullable: false })
  vendor_id: string;

  // BASIC INFORMATION
  @Column({ type: 'varchar', length: 255, nullable: false })
  brand_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  legal_name: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  website_url: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo_url: string;

  // COMPANY DETAILS
  @Column({ type: 'varchar', length: 100, default: 'USA' })
  hq_country: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  hq_state: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  company_size_band: string;

  @Column({ type: 'year', nullable: true })
  founded_year: number;

  // SERVICE CLASSIFICATION
  @Column({ type: 'varchar', length: 100, nullable: true })
  vendor_type: string;

  @Column({ type: 'text', nullable: true, comment: 'Comma-separated list' })
  engagement_models: string;

  @Column({ type: 'text', nullable: true, comment: 'Comma-separated list' })
  service_domains: string;

  // TECHNICAL EXPERIENCE
  @Column({ type: 'text', nullable: true })
  platforms_experience: string;

  @Column({ type: 'text', nullable: true, comment: 'iManage, NetDocuments, Intapp, etc.' })
  legal_tech_stack: string;

  // PROJECT & PRICING
  @Column({ type: 'int', nullable: true })
  lead_time_weeks: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  capacity_band: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  min_project_size_usd: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  max_project_size_usd: number;

  @Column({ type: 'int', nullable: true })
  typical_duration_weeks_min: number;

  @Column({ type: 'int', nullable: true })
  typical_duration_weeks_max: number;

  @Column({ type: 'text', nullable: true })
  pricing_signal_notes: string;

  // PROOF POINTS
  @Column({ type: 'int', default: 0 })
  case_study_count_public: number;

  @Column({ type: 'enum', enum: ['Y', 'N', 'Unk'], default: 'Unk' })
  reference_available: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  proof_link_1: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  proof_link_2: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  proof_link_3: string;

  // RATINGS
  @Column({ type: 'varchar', length: 50, nullable: true })
  rating_source_1: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating_1: number;

  @Column({ type: 'int', default: 0 })
  review_count_1: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  rating_url_1: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  rating_source_2: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating_2: number;

  @Column({ type: 'int', default: 0 })
  review_count_2: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  rating_url_2: string;

  // LEGAL SPECIALIZATION
  @Column({ type: 'enum', enum: ['None', 'Some', 'Strong', 'Legal-only'], default: 'Some' })
  legal_focus_level: string;

  @Column({ type: 'text', nullable: true })
  law_firm_size_fit: string;

  @Column({ type: 'int', nullable: true })
  legal_delivery_years: number;

  @Column({ type: 'enum', enum: ['Y', 'N', 'Unk'], default: 'Unk' })
  legal_references_available: string;

  @Column({ type: 'int', default: 0 })
  legal_case_studies_count: number;

  // SECURITY & COMPLIANCE
  @Column({ type: 'enum', enum: ['Y', 'N', 'Unk'], default: 'Unk' })
  has_soc2: string;

  @Column({ type: 'enum', enum: ['Y', 'N', 'Unk'], default: 'Unk' })
  has_iso27001: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  security_overview_link: string;

  @Column({ type: 'text', nullable: true })
  security_notes: string;

  // METADATA
  @Column({ type: 'varchar', length: 100, default: 'Automated Research' })
  data_owner: string;

  @Column({ type: 'text', nullable: true })
  data_source_notes: string;

  @Column({ type: 'date', nullable: false })
  last_verified_date: Date;

  @Column({ type: 'enum', enum: ['Prospect', 'Validated', 'Active', 'Inactive', 'Do-not-use'], default: 'Prospect' })
  status: string;

  @Column({ type: 'text', nullable: true })
  internal_notes: string;

  // TIMESTAMPS
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
