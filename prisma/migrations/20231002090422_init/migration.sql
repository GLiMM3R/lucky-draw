-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_prizes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "rank" INTEGER,
    "image" TEXT,
    "campaignId" TEXT NOT NULL,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "prizes_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "prizes_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_prizes" ("amount", "campaignId", "createdAt", "createdById", "id", "image", "isActive", "isDone", "rank", "title", "updatedAt") SELECT "amount", "campaignId", "createdAt", "createdById", "id", "image", "isActive", "isDone", "rank", "title", "updatedAt" FROM "prizes";
DROP TABLE "prizes";
ALTER TABLE "new_prizes" RENAME TO "prizes";
CREATE TABLE "new_coupon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "file" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "amount" INTEGER,
    "campaignId" TEXT NOT NULL,
    "isNew" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "coupon_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "coupon_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_coupon" ("campaignId", "createdAt", "createdById", "file", "id", "isNew", "updatedAt") SELECT "campaignId", "createdAt", "createdById", "file", "id", "isNew", "updatedAt" FROM "coupon";
DROP TABLE "coupon";
ALTER TABLE "new_coupon" RENAME TO "coupon";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
