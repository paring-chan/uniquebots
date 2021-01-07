/*
  Warnings:

  - You are about to drop the column `libraryId` on the `Bot` table. All the data in the column will be lost.
  - Added the required column `libraryID` to the `Bot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bot" DROP CONSTRAINT "Bot_libraryId_fkey";

-- AlterTable
ALTER TABLE "Bot" DROP COLUMN "libraryId",
ADD COLUMN     "libraryID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Bot" ADD FOREIGN KEY("libraryID")REFERENCES "Library"("id") ON DELETE CASCADE ON UPDATE CASCADE;
