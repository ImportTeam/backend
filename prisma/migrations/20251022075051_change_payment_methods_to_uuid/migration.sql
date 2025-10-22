/*
  Warnings:

  - You are about to drop the column `user_seq` on the `payment_methods` table. All the data in the column will be lost.
  - Added the required column `user_uuid` to the `payment_methods` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `payment_methods` DROP FOREIGN KEY `payment_methods_user_seq_fkey`;

-- DropIndex
DROP INDEX `payment_methods_user_seq_idx` ON `payment_methods`;

-- AlterTable
ALTER TABLE `payment_methods` DROP COLUMN `user_seq`,
    ADD COLUMN `user_uuid` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `payment_methods_user_uuid_idx` ON `payment_methods`(`user_uuid`);

-- AddForeignKey
ALTER TABLE `payment_methods` ADD CONSTRAINT `payment_methods_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
