/*
  Warnings:

  - You are about to drop the column `file` on the `coupon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "campaigns" ADD COLUMN "file" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_coupon" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
INSERT INTO "new_coupon" ("amount", "campaignId", "createdAt", "createdById", "id", "isNew", "name", "phone", "updatedAt") SELECT "amount", "campaignId", "createdAt", "createdById", "id", "isNew", "name", "phone", "updatedAt" FROM "coupon";
DROP TABLE "coupon";
ALTER TABLE "new_coupon" RENAME TO "coupon";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
