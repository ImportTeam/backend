-- Add persistent category to payment_transactions
ALTER TABLE `payment_transactions`
  ADD COLUMN `category` VARCHAR(50) NOT NULL DEFAULT '기타' AFTER `merchant_name`;

-- Optional performance index for analytics by category/month
CREATE INDEX `payment_transactions_user_uuid_category_created_at_idx`
  ON `payment_transactions`(`user_uuid`, `category`, `created_at`);
