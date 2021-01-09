/*
  Warnings:

  - Added the required column `brief` to the `Bot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Bot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "brief" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL;
