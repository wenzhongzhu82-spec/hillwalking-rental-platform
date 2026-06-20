-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "communityId" TEXT,
    "brand" TEXT,
    "size" TEXT,
    "condition" TEXT NOT NULL DEFAULT 'GOOD',
    "dailyPrice" REAL NOT NULL DEFAULT 0,
    "deposit" REAL NOT NULL DEFAULT 0,
    "pickupLocation" TEXT NOT NULL DEFAULT 'SCIE_ANTUOSHAN',
    "returnLocation" TEXT,
    "availableFrom" DATETIME NOT NULL,
    "availableTo" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "isHillwalkingRecommended" BOOLEAN NOT NULL DEFAULT false,
    "visibility" TEXT NOT NULL DEFAULT 'PUBLIC',
    "safetyNotes" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "images" TEXT NOT NULL DEFAULT '[]',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,
    "adminNote" TEXT,
    "hiddenReason" TEXT,
    "matchScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Item_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Item_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("adminNote", "availableFrom", "availableTo", "brand", "categoryId", "condition", "createdAt", "dailyPrice", "deposit", "description", "favoriteCount", "hiddenReason", "id", "images", "isHillwalkingRecommended", "matchScore", "ownerId", "pickupLocation", "returnLocation", "safetyNotes", "size", "status", "tags", "title", "updatedAt", "viewCount") SELECT "adminNote", "availableFrom", "availableTo", "brand", "categoryId", "condition", "createdAt", "dailyPrice", "deposit", "description", "favoriteCount", "hiddenReason", "id", "images", "isHillwalkingRecommended", "matchScore", "ownerId", "pickupLocation", "returnLocation", "safetyNotes", "size", "status", "tags", "title", "updatedAt", "viewCount" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
