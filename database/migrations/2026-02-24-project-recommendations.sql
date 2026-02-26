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
