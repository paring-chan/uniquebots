/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[slug]` on the table `Bot`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bot.slug_unique" ON "Bot"("slug");
