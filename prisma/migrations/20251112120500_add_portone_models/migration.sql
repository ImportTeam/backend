-- Add PortOne Billing Key fields to payment_methods
ALTER TABLE "payment_methods" 
ADD COLUMN IF NOT EXISTS "billing_key_id" TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS "billing_key_status" VARCHAR(50),
ADD COLUMN IF NOT EXISTS "operator" VARCHAR(20);

-- Create identity_verifications table
CREATE TABLE IF NOT EXISTS "identity_verifications" (
    "seq" BIGSERIAL NOT NULL PRIMARY KEY,
    "uuid" UUID NOT NULL UNIQUE,
    "user_uuid" TEXT NOT NULL,
    "portone_id" TEXT NOT NULL UNIQUE,
    "channel_key" VARCHAR(255) NOT NULL,
    "operator" VARCHAR(20) NOT NULL,
    "method" VARCHAR(20) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "customer_name" VARCHAR(100),
    "customer_phone" VARCHAR(20),
    "customer_email" VARCHAR(255),
    "custom_data" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL,
    "status_changed_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "identity_verifications_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users" ("uuid") ON DELETE CASCADE
);

-- Create indexes for identity_verifications
CREATE INDEX IF NOT EXISTS "identity_verifications_user_uuid_idx" ON "identity_verifications"("user_uuid");
CREATE INDEX IF NOT EXISTS "identity_verifications_portone_id_idx" ON "identity_verifications"("portone_id");
CREATE INDEX IF NOT EXISTS "identity_verifications_status_idx" ON "identity_verifications"("status");
CREATE INDEX IF NOT EXISTS "identity_verifications_created_at_idx" ON "identity_verifications"("created_at");

-- Add PortOne Payment fields to payment_transactions
ALTER TABLE "payment_transactions"
ADD COLUMN IF NOT EXISTS "portone_payment_id" TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS "portone_transaction_id" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "status" VARCHAR(50) DEFAULT 'PENDING';

-- Create indexes for payment_transactions
CREATE INDEX IF NOT EXISTS "payment_transactions_portone_payment_id_idx" ON "payment_transactions"("portone_payment_id");
CREATE INDEX IF NOT EXISTS "payment_transactions_status_idx" ON "payment_transactions"("status");

-- Create indexes for payment_methods
CREATE INDEX IF NOT EXISTS "payment_methods_billing_key_id_idx" ON "payment_methods"("billing_key_id");
