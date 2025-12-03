-- CreateTable
CREATE TABLE `users` (
    `seq` BIGINT NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `password_hash` VARCHAR(191) NULL,
    `social_provider` VARCHAR(191) NOT NULL DEFAULT 'NONE',
    `social_id` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `preferred_payment_seq` BIGINT NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `verified_at` DATETIME(3) NULL,
    `ci` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_uuid_key`(`uuid`),
    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_ci_key`(`ci`),
    PRIMARY KEY (`seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_methods` (
    `seq` BIGINT NOT NULL AUTO_INCREMENT,
    `user_uuid` VARCHAR(191) NOT NULL,
    `type` ENUM('CARD', 'PAYPAL', 'APPLEPAY', 'KAKAOPAY', 'NAVERPAY', 'ETC') NOT NULL,
    `card_number_hash` VARCHAR(255) NULL,
    `last_4_nums` CHAR(4) NOT NULL,
    `card_holder_name` VARCHAR(100) NULL,
    `provider_name` VARCHAR(50) NOT NULL,
    `card_brand` VARCHAR(20) NULL,
    `expiry_month` CHAR(2) NULL,
    `expiry_year` CHAR(4) NULL,
    `cvv_hash` VARCHAR(255) NULL,
    `billing_address` VARCHAR(255) NULL,
    `billing_zip` VARCHAR(20) NULL,
    `alias` VARCHAR(50) NULL,
    `is_primary` BOOLEAN NOT NULL DEFAULT false,
    `billing_key_id` VARCHAR(191) NULL,
    `billing_key_status` VARCHAR(50) NULL,
    `operator` VARCHAR(20) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_methods_billing_key_id_key`(`billing_key_id`),
    INDEX `payment_methods_user_uuid_idx`(`user_uuid`),
    INDEX `payment_methods_billing_key_id_idx`(`billing_key_id`),
    INDEX `payment_methods_expiry_year_expiry_month_idx`(`expiry_year`, `expiry_month`),
    PRIMARY KEY (`seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_sessions` (
    `seq` BIGINT NOT NULL AUTO_INCREMENT,
    `user_seq` BIGINT NOT NULL,
    `access_token` VARCHAR(500) NOT NULL,
    `refresh_token` VARCHAR(500) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `device_info` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_sessions_user_seq_idx`(`user_seq`),
    INDEX `user_sessions_expires_at_idx`(`expires_at`),
    PRIMARY KEY (`seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_settings` (
    `user_seq` BIGINT NOT NULL,
    `dark_mode` BOOLEAN NOT NULL DEFAULT false,
    `notification_enabled` BOOLEAN NOT NULL DEFAULT true,
    `compare_mode` VARCHAR(191) NOT NULL DEFAULT 'AUTO',
    `currency_preference` VARCHAR(191) NOT NULL DEFAULT 'KRW',
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`user_seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_transactions` (
    `seq` BIGINT NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(36) NOT NULL,
    `user_uuid` VARCHAR(191) NOT NULL,
    `payment_method_seq` BIGINT NULL,
    `merchant_name` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(19, 2) NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'KRW',
    `benefit_value` DECIMAL(19, 2) NULL,
    `benefit_desc` VARCHAR(255) NULL,
    `compared_at` DATETIME(3) NULL,
    `portone_payment_id` VARCHAR(191) NULL,
    `portone_transaction_id` VARCHAR(255) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_transactions_uuid_key`(`uuid`),
    UNIQUE INDEX `payment_transactions_portone_payment_id_key`(`portone_payment_id`),
    INDEX `payment_transactions_user_uuid_created_at_idx`(`user_uuid`, `created_at`),
    INDEX `payment_transactions_user_uuid_status_created_at_idx`(`user_uuid`, `status`, `created_at`),
    INDEX `payment_transactions_payment_method_seq_idx`(`payment_method_seq`),
    INDEX `payment_transactions_portone_payment_id_idx`(`portone_payment_id`),
    INDEX `payment_transactions_status_idx`(`status`),
    PRIMARY KEY (`seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `identity_verifications` (
    `seq` BIGINT NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(36) NOT NULL,
    `user_uuid` VARCHAR(191) NOT NULL,
    `portone_id` VARCHAR(191) NOT NULL,
    `channel_key` VARCHAR(255) NOT NULL,
    `operator` VARCHAR(20) NOT NULL,
    `method` VARCHAR(20) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `customer_name` VARCHAR(100) NULL,
    `customer_phone` VARCHAR(20) NULL,
    `customer_email` VARCHAR(255) NULL,
    `ci` VARCHAR(255) NULL,
    `di` VARCHAR(255) NULL,
    `custom_data` TEXT NULL,
    `requested_at` DATETIME(3) NOT NULL,
    `status_changed_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `identity_verifications_uuid_key`(`uuid`),
    UNIQUE INDEX `identity_verifications_portone_id_key`(`portone_id`),
    UNIQUE INDEX `identity_verifications_ci_key`(`ci`),
    INDEX `identity_verifications_user_uuid_idx`(`user_uuid`),
    INDEX `identity_verifications_portone_id_idx`(`portone_id`),
    INDEX `identity_verifications_status_idx`(`status`),
    INDEX `identity_verifications_created_at_idx`(`created_at`),
    INDEX `identity_verifications_ci_idx`(`ci`),
    PRIMARY KEY (`seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `benefit_offers` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `provider_name` VARCHAR(50) NOT NULL,
    `payment_type` ENUM('CARD', 'PAYPAL', 'APPLEPAY', 'KAKAOPAY', 'NAVERPAY', 'ETC') NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `merchant_filter` VARCHAR(255) NULL,
    `category_filter` VARCHAR(100) NULL,
    `min_spend` DECIMAL(19, 2) NULL,
    `discount_type` ENUM('PERCENT', 'FLAT') NOT NULL,
    `discount_value` DECIMAL(19, 2) NOT NULL,
    `max_discount` DECIMAL(19, 2) NULL,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `source_url` VARCHAR(255) NULL,
    `hash` VARCHAR(64) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `benefit_offers_hash_key`(`hash`),
    INDEX `benefit_offers_provider_name_idx`(`provider_name`),
    INDEX `benefit_offers_active_end_date_idx`(`active`, `end_date`),
    INDEX `benefit_offers_active_provider_name_end_date_idx`(`active`, `provider_name`, `end_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payment_methods` ADD CONSTRAINT `payment_methods_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_user_seq_fkey` FOREIGN KEY (`user_seq`) REFERENCES `users`(`seq`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_settings` ADD CONSTRAINT `user_settings_user_seq_fkey` FOREIGN KEY (`user_seq`) REFERENCES `users`(`seq`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_transactions` ADD CONSTRAINT `payment_transactions_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `identity_verifications` ADD CONSTRAINT `identity_verifications_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
