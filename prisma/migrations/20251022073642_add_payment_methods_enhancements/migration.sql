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
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_uuid_key`(`uuid`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_methods` (
    `seq` BIGINT NOT NULL AUTO_INCREMENT,
    `user_seq` BIGINT NOT NULL,
    `type` ENUM('CARD', 'PAYPAL', 'APPLEPAY', 'KAKAOPAY', 'NAVERPAY', 'ETC') NOT NULL,
    `provider_name` VARCHAR(50) NOT NULL,
    `last_4_nums` CHAR(4) NOT NULL,
    `alias` VARCHAR(50) NULL,
    `is_primary` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `payment_methods_user_seq_idx`(`user_seq`),
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

-- AddForeignKey
ALTER TABLE `payment_methods` ADD CONSTRAINT `payment_methods_user_seq_fkey` FOREIGN KEY (`user_seq`) REFERENCES `users`(`seq`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_user_seq_fkey` FOREIGN KEY (`user_seq`) REFERENCES `users`(`seq`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_settings` ADD CONSTRAINT `user_settings_user_seq_fkey` FOREIGN KEY (`user_seq`) REFERENCES `users`(`seq`) ON DELETE CASCADE ON UPDATE CASCADE;
