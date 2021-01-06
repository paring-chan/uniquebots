-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "discriminator" INTEGER NOT NULL,
    "avatar" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bot" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatarURL" TEXT NOT NULL,
    "ownerID" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bot" ADD FOREIGN KEY("ownerID")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
