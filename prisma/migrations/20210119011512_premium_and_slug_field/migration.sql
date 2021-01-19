-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "slug" TEXT,
ADD COLUMN     "premium" BOOLEAN NOT NULL DEFAULT false;
