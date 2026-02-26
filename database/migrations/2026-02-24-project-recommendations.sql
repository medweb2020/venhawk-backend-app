USE venhawk;

SET @db := DATABASE();

SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = @db
        AND TABLE_NAME = 'vendors'
        AND COLUMN_NAME = 'ilta_present'
    ),
    'SELECT "ilta_present already exists"',
    'ALTER TABLE vendors ADD COLUMN ilta_present BOOLEAN NOT NULL DEFAULT FALSE AFTER has_iso27001'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = @db
        AND TABLE_NAME = 'vendors'
        AND COLUMN_NAME = 'is_microsoft_partner'
    ),
    'SELECT "is_microsoft_partner already exists"',
    'ALTER TABLE vendors ADD COLUMN is_microsoft_partner BOOLEAN NOT NULL DEFAULT FALSE AFTER ilta_present'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = @db
        AND TABLE_NAME = 'vendors'
        AND COLUMN_NAME = 'is_servicenow_partner'
    ),
    'SELECT "is_servicenow_partner already exists"',
    'ALTER TABLE vendors ADD COLUMN is_servicenow_partner BOOLEAN NOT NULL DEFAULT FALSE AFTER is_microsoft_partner'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = @db
        AND TABLE_NAME = 'vendors'
        AND COLUMN_NAME = 'is_workday_partner'
    ),
    'SELECT "is_workday_partner already exists"',
    'ALTER TABLE vendors ADD COLUMN is_workday_partner BOOLEAN NOT NULL DEFAULT FALSE AFTER is_servicenow_partner'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS project_vendor_matches (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id BIGINT UNSIGNED NOT NULL,
  vendor_id INT NOT NULL,
  rank_position INT NOT NULL,
  raw_score DECIMAL(6,2) NOT NULL,
  display_score INT NOT NULL,
  score_breakdown_json JSON DEFAULT NULL,
  scoring_version VARCHAR(32) NOT NULL DEFAULT 'v1',
  computed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_project_vendor_matches_project_vendor (project_id, vendor_id),
  KEY idx_project_vendor_matches_project_rank (project_id, rank_position),
  KEY idx_project_vendor_matches_computed_at (computed_at),
  CONSTRAINT fk_project_vendor_matches_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_project_vendor_matches_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
