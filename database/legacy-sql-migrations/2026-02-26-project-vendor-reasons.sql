USE venhawk;

CREATE TABLE IF NOT EXISTS project_vendor_reasons (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id BIGINT UNSIGNED NOT NULL,
  vendor_id INT NOT NULL,
  reason_text VARCHAR(420) NOT NULL,
  reason_source VARCHAR(16) NOT NULL DEFAULT 'fallback',
  context_hash CHAR(40) NOT NULL,
  model VARCHAR(64) DEFAULT NULL,
  computed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_project_vendor_reasons_project_vendor (project_id, vendor_id),
  KEY idx_project_vendor_reasons_project_updated (project_id, updated_at),
  CONSTRAINT fk_project_vendor_reasons_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_project_vendor_reasons_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
