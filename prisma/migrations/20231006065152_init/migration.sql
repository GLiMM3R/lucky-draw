/*
  Warnings:

  - You are about to drop the column `campaignType` on the `campaigns` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `coupon` table. All the data in the column will be lost.
  - Added the required column `type` to the `campaigns` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_campaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "prizeCap" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "file" TEXT,
    "createdById" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "campaigns_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_campaigns" ("createdAt", "createdById", "file", "id", "isActive", "prizeCap", "title", "updatedAt") SELECT "createdAt", "createdById", "file", "id", "isActive", "prizeCap", "title", "updatedAt" FROM "campaigns";
DROP TABLE "campaigns";
ALTER TABLE "new_campaigns" RENAME TO "campaigns";
CREATE TABLE "new_coupon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "phone" TEXT,
    "campaignId" TEXT NOT NULL,
    "isNew" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "coupon_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "coupon_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_coupon" ("campaignId", "createdAt", "createdById", "id", "isNew", "name", "phone", "updatedAt") SELECT "campaignId", "createdAt", "createdById", "id", "isNew", "name", "phone", "updatedAt" FROM "coupon";
DROP TABLE "coupon";
ALTER TABLE "new_coupon" RENAME TO "coupon";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
