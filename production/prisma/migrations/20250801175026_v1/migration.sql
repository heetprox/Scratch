/*
  Warnings:

  - You are about to drop the column `scratch_card_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the `api_keys` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sender_id` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_scratch_card_id_fkey";

-- DropIndex
DROP INDEX "public"."payments_scratch_card_id_idx";

-- AlterTable
ALTER TABLE "public"."payments" DROP COLUMN "scratch_card_id",
ADD COLUMN     "sender_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."api_keys";

-- DropTable
DROP TABLE "public"."event_logs";

-- DropTable
DROP TABLE "public"."transactions";

-- DropEnum
DROP TYPE "public"."EventType";

-- DropEnum
DROP TYPE "public"."TransactionStatus";

-- CreateIndex
CREATE INDEX "payments_sender_id_idx" ON "public"."payments"("sender_id");

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."scratch_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
