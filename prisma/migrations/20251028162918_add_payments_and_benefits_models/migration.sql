-- CreateTable
CREATE TABLE `payment_transactions` (
    `seq` BIGINT NOT NULL AUTO_INCREMENT,
    `user_uuid` VARCHAR(191) NOT NULL,
    `payment_method_seq` BIGINT NULL,
    `merchant_name` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(19, 2) NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'KRW',
    `benefit_value` DECIMAL(19, 2) NULL,
    `benefit_desc` VARCHAR(255) NULL,
    `compared_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `payment_transactions_user_uuid_created_at_idx`(`user_uuid`, `created_at`),
    INDEX `payment_transactions_payment_method_seq_idx`(`payment_method_seq`),
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
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payment_transactions` ADD CONSTRAINT `payment_transactions_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
