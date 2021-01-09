/*
  Warnings:

  - You are about to drop the column `approved` on the `Bot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bot" DROP COLUMN "approved",
ADD COLUMN     "pending" BOOLEAN NOT NULL DEFAULT false;
