-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "website" TEXT,
ADD COLUMN     "git" TEXT,
ADD COLUMN     "support" TEXT,
ADD COLUMN     "libraryId" TEXT;

-- CreateTable
CREATE TABLE "Library" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bot" ADD FOREIGN KEY("libraryId")REFERENCES "Library"("id") ON DELETE SET NULL ON UPDATE CASCADE;
