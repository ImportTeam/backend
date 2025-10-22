/*
  Warnings:

  - Added the required column `updated_at` to the `payment_methods` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment_methods` ADD COLUMN `billing_address` VARCHAR(255) NULL,
    ADD COLUMN `billing_zip` VARCHAR(20) NULL,
    ADD COLUMN `card_brand` VARCHAR(20) NULL,
    ADD COLUMN `card_holder_name` VARCHAR(100) NULL,
    ADD COLUMN `card_number_hash` VARCHAR(255) NULL,
    ADD COLUMN `cvv_hash` VARCHAR(255) NULL,
    ADD COLUMN `expiry_month` CHAR(2) NULL,
    ADD COLUMN `expiry_year` CHAR(4) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE INDEX `payment_methods_expiry_year_expiry_month_idx` ON `payment_methods`(`expiry_year`, `expiry_month`);
