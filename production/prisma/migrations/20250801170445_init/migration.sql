-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED', 'DROPPED');

-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('PAYMENT_SENT', 'PAYMENT_RECEIVED', 'WALLET_CONNECTED', 'SCRATCH_CARD_CREATED', 'SCRATCH_CARD_UPDATED');

-- CreateTable
CREATE TABLE "public"."scratch_cards" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "wallet_addresses" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scratch_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" TEXT NOT NULL,
    "scratch_card_id" TEXT NOT NULL,
    "amount" DECIMAL(18,8) NOT NULL,
    "network" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "transaction_hash" TEXT,
    "timestamp" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transactions" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT,
    "sender" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "amount" DECIMAL(18,8) NOT NULL,
    "message" TEXT,
    "transaction_hash" TEXT NOT NULL,
    "block_number" BIGINT,
    "gas_used" BIGINT,
    "gas_price" BIGINT,
    "network" TEXT NOT NULL,
    "status" "public"."TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "timestamp" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."event_logs" (
    "id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "transaction_hash" TEXT NOT NULL,
    "block_number" BIGINT NOT NULL,
    "log_index" INTEGER NOT NULL,
    "network" TEXT NOT NULL,
    "event_data" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."api_keys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL,
    "permissions" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "last_used" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scratch_cards_username_key" ON "public"."scratch_cards"("username");

-- CreateIndex
CREATE INDEX "scratch_cards_username_idx" ON "public"."scratch_cards"("username");

-- CreateIndex
CREATE INDEX "scratch_cards_created_at_idx" ON "public"."scratch_cards"("created_at");

-- CreateIndex
CREATE INDEX "payments_scratch_card_id_idx" ON "public"."payments"("scratch_card_id");

-- CreateIndex
CREATE INDEX "payments_transaction_hash_idx" ON "public"."payments"("transaction_hash");

-- CreateIndex
CREATE INDEX "payments_done_idx" ON "public"."payments"("done");

-- CreateIndex
CREATE INDEX "payments_created_at_idx" ON "public"."payments"("created_at");

-- CreateIndex
CREATE INDEX "payments_network_address_idx" ON "public"."payments"("network", "address");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transaction_hash_key" ON "public"."transactions"("transaction_hash");

-- CreateIndex
CREATE INDEX "transactions_transaction_hash_idx" ON "public"."transactions"("transaction_hash");

-- CreateIndex
CREATE INDEX "transactions_sender_idx" ON "public"."transactions"("sender");

-- CreateIndex
CREATE INDEX "transactions_recipient_idx" ON "public"."transactions"("recipient");

-- CreateIndex
CREATE INDEX "transactions_network_idx" ON "public"."transactions"("network");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "public"."transactions"("status");

-- CreateIndex
CREATE INDEX "transactions_timestamp_idx" ON "public"."transactions"("timestamp");

-- CreateIndex
CREATE INDEX "event_logs_event_type_idx" ON "public"."event_logs"("event_type");

-- CreateIndex
CREATE INDEX "event_logs_network_idx" ON "public"."event_logs"("network");

-- CreateIndex
CREATE INDEX "event_logs_processed_idx" ON "public"."event_logs"("processed");

-- CreateIndex
CREATE INDEX "event_logs_block_number_idx" ON "public"."event_logs"("block_number");

-- CreateIndex
CREATE UNIQUE INDEX "event_logs_transaction_hash_log_index_key" ON "public"."event_logs"("transaction_hash", "log_index");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_hash_key" ON "public"."api_keys"("key_hash");

-- CreateIndex
CREATE INDEX "api_keys_key_hash_idx" ON "public"."api_keys"("key_hash");

-- CreateIndex
CREATE INDEX "api_keys_active_idx" ON "public"."api_keys"("active");

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_scratch_card_id_fkey" FOREIGN KEY ("scratch_card_id") REFERENCES "public"."scratch_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
