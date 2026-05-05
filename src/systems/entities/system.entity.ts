import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type SystemCategory =
  | 'legal_practice_management'
  | 'legal_dms'
  | 'legal_billing'
  | 'legal_crm'
  | 'legal_compliance'
  | 'cloud_infrastructure'
  | 'enterprise_erp'
  | 'enterprise_hcm'
  | 'enterprise_crm'
  | 'enterprise_itsm'
  | 'data_analytics'
  | 'collaboration'
  | 'security_network'
  | 'other';

@Entity('systems')
@Index('idx_systems_product_family', ['product_family'])
@Index('idx_systems_category', ['category'])
@Index('idx_systems_is_active', ['is_active'])
export class System {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 120, unique: true, nullable: false })
  canonical_name: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  product_family: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  vendor_owner: string | null;

  @Column({
    type: 'enum',
    enum: [
      'legal_practice_management',
      'legal_dms',
      'legal_billing',
      'legal_crm',
      'legal_compliance',
      'cloud_infrastructure',
      'enterprise_erp',
      'enterprise_hcm',
      'enterprise_crm',
      'enterprise_itsm',
      'data_analytics',
      'collaboration',
      'security_network',
      'other',
    ],
    default: 'other',
    nullable: false,
    comment: 'System category used for filtering and UI grouping',
  })
  category: SystemCategory;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Lowercase alias strings used for fuzzy/alias matching',
  })
  aliases: string[] | null;

  @Column({ type: 'tinyint', width: 1, default: 1, nullable: false })
  is_active: boolean;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
