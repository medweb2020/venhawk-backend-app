USE venhawk;

SET @db := DATABASE();

SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = @db
        AND TABLE_NAME = 'vendors'
        AND COLUMN_NAME = 'logo_url'
    ),
    'SELECT "logo_url already exists"',
    'ALTER TABLE vendors ADD COLUMN logo_url VARCHAR(500) NULL AFTER website_url'
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
        AND COLUMN_NAME = 'listing_order'
    ),
    'SELECT "listing_order already exists"',
    'ALTER TABLE vendors ADD COLUMN listing_order INT NULL AFTER logo_url'
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
        AND COLUMN_NAME = 'listing_description'
    ),
    'SELECT "listing_description already exists"',
    'ALTER TABLE vendors ADD COLUMN listing_description TEXT NULL AFTER listing_order'
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
        AND COLUMN_NAME = 'listing_specialty'
    ),
    'SELECT "listing_specialty already exists"',
    'ALTER TABLE vendors ADD COLUMN listing_specialty VARCHAR(100) NULL AFTER listing_description'
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
        AND COLUMN_NAME = 'listing_tier'
    ),
    'SELECT "listing_tier already exists"',
    'ALTER TABLE vendors ADD COLUMN listing_tier VARCHAR(20) NULL AFTER listing_specialty'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
