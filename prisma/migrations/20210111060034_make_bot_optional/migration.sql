-- DropForeignKey
ALTER TABLE "Judge" DROP CONSTRAINT "Judge_botID_fkey";

-- AlterTable
ALTER TABLE "Judge" ADD COLUMN     "botId" TEXT;

-- AddForeignKey
ALTER TABLE "Judge" ADD FOREIGN KEY("botId")REFERENCES "Bot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
