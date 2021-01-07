-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BotToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BotToCategory_AB_unique" ON "_BotToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_BotToCategory_B_index" ON "_BotToCategory"("B");

-- AddForeignKey
ALTER TABLE "_BotToCategory" ADD FOREIGN KEY("A")REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BotToCategory" ADD FOREIGN KEY("B")REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
