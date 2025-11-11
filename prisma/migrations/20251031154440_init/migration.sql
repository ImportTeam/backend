-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CARD', 'PAYPAL', 'APPLEPAY', 'KAKAOPAY', 'NAVERPAY', 'ETC');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENT', 'FLAT');

-- CreateTable
CREATE TABLE "users" (
    "seq" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "email" TEXT,
    "password_hash" TEXT,
    "social_provider" TEXT NOT NULL DEFAULT 'NONE',
    "social_id" TEXT,
    "name" TEXT NOT NULL,
    "preferred_payment_seq" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("seq")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "seq" BIGSERIAL NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL,
    "card_number_hash" VARCHAR(255),
    "last_4_nums" CHAR(4) NOT NULL,
    "card_holder_name" VARCHAR(100),
    "provider_name" VARCHAR(50) NOT NULL,
    "card_brand" VARCHAR(20),
    "expiry_month" CHAR(2),
    "expiry_year" CHAR(4),
    "cvv_hash" VARCHAR(255),
    "billing_address" VARCHAR(255),
    "billing_zip" VARCHAR(20),
    "alias" VARCHAR(50),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("seq")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "seq" BIGSERIAL NOT NULL,
    "user_seq" BIGINT NOT NULL,
    "access_token" VARCHAR(500) NOT NULL,
    "refresh_token" VARCHAR(500) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "device_info" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("seq")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "user_seq" BIGINT NOT NULL,
    "dark_mode" BOOLEAN NOT NULL DEFAULT false,
    "notification_enabled" BOOLEAN NOT NULL DEFAULT true,
    "compare_mode" TEXT NOT NULL DEFAULT 'AUTO',
    "currency_preference" TEXT NOT NULL DEFAULT 'KRW',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("user_seq")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "seq" BIGSERIAL NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "payment_method_seq" BIGINT,
    "merchant_name" VARCHAR(255) NOT NULL,
    "amount" DECIMAL(19,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KRW',
    "benefit_value" DECIMAL(19,2),
    "benefit_desc" VARCHAR(255),
    "compared_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("seq")
);

-- CreateTable
CREATE TABLE "benefit_offers" (
    "id" BIGSERIAL NOT NULL,
    "provider_name" VARCHAR(50) NOT NULL,
    "payment_type" "PaymentType",
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "merchant_filter" VARCHAR(255),
    "category_filter" VARCHAR(100),
    "min_spend" DECIMAL(19,2),
    "discount_type" "DiscountType" NOT NULL,
    "discount_value" DECIMAL(19,2) NOT NULL,
    "max_discount" DECIMAL(19,2),
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "source_url" VARCHAR(255),
    "hash" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "benefit_offers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_uuid_key" ON "users"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "payment_methods_user_uuid_idx" ON "payment_methods"("user_uuid");

-- CreateIndex
CREATE INDEX "payment_methods_expiry_year_expiry_month_idx" ON "payment_methods"("expiry_year", "expiry_month");

-- CreateIndex
CREATE INDEX "user_sessions_user_seq_idx" ON "user_sessions"("user_seq");

-- CreateIndex
CREATE INDEX "user_sessions_expires_at_idx" ON "user_sessions"("expires_at");

-- CreateIndex
CREATE INDEX "payment_transactions_user_uuid_created_at_idx" ON "payment_transactions"("user_uuid", "created_at");

-- CreateIndex
CREATE INDEX "payment_transactions_payment_method_seq_idx" ON "payment_transactions"("payment_method_seq");

-- CreateIndex
CREATE UNIQUE INDEX "benefit_offers_hash_key" ON "benefit_offers"("hash");

-- CreateIndex
CREATE INDEX "benefit_offers_provider_name_idx" ON "benefit_offers"("provider_name");

-- CreateIndex
CREATE INDEX "benefit_offers_active_end_date_idx" ON "benefit_offers"("active", "end_date");

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_seq_fkey" FOREIGN KEY ("user_seq") REFERENCES "users"("seq") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_seq_fkey" FOREIGN KEY ("user_seq") REFERENCES "users"("seq") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
