/*
  Warnings:

  - Added the required column `prefix` to the `Bot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "prefix" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Judge" (
"id" SERIAL,
    "botID" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "denyReason" TEXT,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Judge" ADD FOREIGN KEY("botID")REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
