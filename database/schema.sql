-- MySQL dump 10.13  Distrib 9.6.0, for macos14.8 (arm64)
--
-- Host: localhost    Database: venhawk
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'e5c1a82e-f8aa-11f0-82db-eb4287e0cd61:1-41';

--
-- Table structure for table `client_industries`
--

DROP TABLE IF EXISTS `client_industries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_industries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `value` (`value`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_industries`
--

LOCK TABLES `client_industries` WRITE;
/*!40000 ALTER TABLE `client_industries` DISABLE KEYS */;
INSERT INTO `client_industries` VALUES (1,'legal','Legal','2026-01-24 10:05:21');
/*!40000 ALTER TABLE `client_industries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_categories`
--

DROP TABLE IF EXISTS `project_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `value` (`value`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_categories`
--

LOCK TABLES `project_categories` WRITE;
/*!40000 ALTER TABLE `project_categories` DISABLE KEYS */;
INSERT INTO project_categories (value, label) VALUES
  ('legal-apps', 'Legal Application Implementations & Migrations (Intapp, iManage, NetDocuments, Elite, Aderant)'),
  ('cloud-migration', 'Cloud Migrations & Modernization (Azure, AWS, GCP, hybrid cloud)'),
  ('enterprise-it', 'Enterprise IT Implementations & Modernization (ServiceNow, Workday, M365 migrations, AV systems)'),
  ('app-upgrades', 'Application Upgrades & Integrations (Legacy apps, custom systems, APIs)'),
  ('collaboration', 'Collaboration & Document Management (Microsoft Teams, SharePoint, M365)'),
  ('security', 'Security, Identity & Compliance (IAM, Entra ID, SOC2, zero trust)'),
  ('data-archive', 'Data, Archive & eDiscovery (Email archive, retention, eDiscovery)'),
  ('other', 'Other');
/*!40000 ALTER TABLE `project_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL COMMENT 'Foreign key to users.id',
  `project_title` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `system_name` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'System name for the project',
  `client_industry_id` int NOT NULL,
  `project_category_id` int NOT NULL,
  `project_category_custom` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Custom category when category is Other',
  `project_objective` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `business_requirements` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `technical_requirements` text COLLATE utf8mb4_unicode_ci,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `flexible_dates` tinyint(1) DEFAULT '0',
  `budget_type` enum('single','range') COLLATE utf8mb4_unicode_ci NOT NULL,
  `budget_amount` decimal(15,2) DEFAULT NULL COMMENT 'Used when budget_type = single',
  `budget_min` decimal(15,2) DEFAULT NULL COMMENT 'Used when budget_type = range',
  `budget_max` decimal(15,2) DEFAULT NULL COMMENT 'Used when budget_type = range',
  `budget_currency` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT 'USD',
  `status` enum('draft','submitted','in_review','approved','rejected','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete',
  PRIMARY KEY (`id`),
  KEY `client_industry_id` (`client_industry_id`),
  KEY `project_category_id` (`project_category_id`),
  KEY `idx_user_status` (`user_id`,`status`),
  KEY `idx_submitted_at` (`submitted_at`),
  KEY `idx_deleted_at` (`deleted_at`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`client_industry_id`) REFERENCES `client_industries` (`id`),
  CONSTRAINT `projects_ibfk_3` FOREIGN KEY (`project_category_id`) REFERENCES `project_categories` (`id`),
  CONSTRAINT `chk_budget_range` CHECK (((`budget_max` is null) or (`budget_max` >= `budget_min`))),
  CONSTRAINT `chk_budget_single` CHECK ((((`budget_type` = _utf8mb4'single') and (`budget_amount` is not null) and (`budget_min` is null) and (`budget_max` is null)) or ((`budget_type` = _utf8mb4'range') and (`budget_amount` is null) and (`budget_min` is not null) and (`budget_max` is not null)))),
  CONSTRAINT `chk_category_custom` CHECK ((((`project_category_id` = 14) and (`project_category_custom` is not null)) or (`project_category_id` <> 14)))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_files`
--

DROP TABLE IF EXISTS `project_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_files` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint unsigned NOT NULL,
  `file_url` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Supabase storage URL',
  `file_name` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Original filename',
  `file_size` bigint NOT NULL COMMENT 'File size in bytes',
  `mime_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'MIME type of the file',
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
  PRIMARY KEY (`id`),
  KEY `idx_project_id` (`project_id`),
  KEY `idx_deleted_at` (`deleted_at`),
  KEY `idx_project_files_lookup` (`project_id`,`deleted_at`),
  CONSTRAINT `fk_project_files_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_files`
--

LOCK TABLES `project_files` WRITE;
/*!40000 ALTER TABLE `project_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `auth0_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Auth0 user ID (sub claim)',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `picture` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth0_id` (`auth0_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_auth0_id` (`auth0_id`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- TABLE 1: VENDORS (Main table with ALL vendor info - 47 columns)
-- ============================================================================

DROP TABLE IF EXISTS vendors;

CREATE TABLE vendors (
    -- Primary Key
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id CHAR(36) UNIQUE NOT NULL COMMENT 'UUID from CSV',
    
    -- BASIC INFORMATION
    brand_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    website_url VARCHAR(500) NOT NULL,
    logo_url VARCHAR(500),
    listing_order INT,
    listing_description TEXT,
    listing_specialty VARCHAR(100),
    listing_tier VARCHAR(20),
    
    -- COMPANY DETAILS
    hq_country VARCHAR(100) DEFAULT 'USA',
    hq_state VARCHAR(100),
    company_size_band VARCHAR(50),
    founded_year YEAR,
    
    -- SERVICE CLASSIFICATION
    vendor_type VARCHAR(100),
    engagement_models TEXT COMMENT 'Comma-separated list',
    service_domains TEXT COMMENT 'Comma-separated list',
    
    -- TECHNICAL EXPERIENCE
    platforms_experience TEXT,
    legal_tech_stack TEXT COMMENT 'iManage, NetDocuments, Intapp, etc.',
    
    -- PROJECT & PRICING
    lead_time_weeks INT,
    capacity_band VARCHAR(20),
    min_project_size_usd DECIMAL(12,2),
    max_project_size_usd DECIMAL(12,2),
    typical_duration_weeks_min INT,
    typical_duration_weeks_max INT,
    pricing_signal_notes TEXT,
    
    -- PROOF POINTS
    case_study_count_public INT DEFAULT 0,
    reference_available ENUM('Y', 'N', 'Unk') DEFAULT 'Unk',
    proof_link_1 VARCHAR(500),
    proof_link_2 VARCHAR(500),
    proof_link_3 VARCHAR(500),
    
    -- RATINGS (stored in main table for easy access)
    rating_source_1 VARCHAR(50),
    rating_1 DECIMAL(3,2),
    review_count_1 INT DEFAULT 0,
    rating_url_1 VARCHAR(500),
    
    rating_source_2 VARCHAR(50),
    rating_2 DECIMAL(3,2),
    review_count_2 INT DEFAULT 0,
    rating_url_2 VARCHAR(500),
    
    -- LEGAL SPECIALIZATION
    legal_focus_level ENUM('None', 'Some', 'Strong', 'Legal-only') DEFAULT 'Some',
    law_firm_size_fit TEXT,
    legal_delivery_years INT,
    legal_references_available ENUM('Y', 'N', 'Unk') DEFAULT 'Unk',
    legal_case_studies_count INT DEFAULT 0,
    
    -- SECURITY & COMPLIANCE
    has_soc2 ENUM('Y', 'N', 'Unk') DEFAULT 'Unk',
    has_iso27001 ENUM('Y', 'N', 'Unk') DEFAULT 'Unk',
    security_overview_link VARCHAR(500),
    security_notes TEXT,
    
    -- METADATA
    data_owner VARCHAR(100) DEFAULT 'Automated Research',
    data_source_notes TEXT,
    last_verified_date DATE NOT NULL,
    status ENUM('Prospect', 'Validated', 'Active', 'Inactive', 'Do-not-use') DEFAULT 'Prospect',
    internal_notes TEXT,
    
    -- TIMESTAMPS
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- INDEXES
    INDEX idx_brand_name (brand_name),
    INDEX idx_vendor_type (vendor_type),
    INDEX idx_status (status),
    INDEX idx_legal_focus (legal_focus_level),
    INDEX idx_budget (min_project_size_usd, max_project_size_usd),
    INDEX idx_ratings (rating_1, rating_2),
    
    FULLTEXT INDEX ft_search (brand_name, legal_tech_stack, platforms_experience)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 2: VENDOR_RATINGS (Optional - for multiple ratings per source)
-- ============================================================================

DROP TABLE IF EXISTS vendor_ratings;

CREATE TABLE vendor_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id CHAR(36) NOT NULL,
    rating_source VARCHAR(50) NOT NULL,
    rating_value DECIMAL(3,2),
    review_count INT DEFAULT 0,
    rating_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    UNIQUE KEY (vendor_id, rating_source),
    INDEX idx_rating_value (rating_value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 3: VENDOR_TECH_STACK (Optional - for detailed platform tracking)
-- ============================================================================

DROP TABLE IF EXISTS vendor_tech_stack;

CREATE TABLE vendor_tech_stack (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id CHAR(36) NOT NULL,
    platform_name VARCHAR(100) NOT NULL,
    expertise_level ENUM('Basic', 'Advanced', 'Expert', 'Certified') DEFAULT 'Advanced',
    years_experience INT,
    is_certified_partner BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    UNIQUE KEY (vendor_id, platform_name),
    INDEX idx_platform (platform_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-25  3:08:31
