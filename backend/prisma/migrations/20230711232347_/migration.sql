/*
  Warnings:

  - You are about to alter the column `buffer` on the `Img` table. The data in that column could be lost. The data in that column will be cast from `String` to `Binary`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Img" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "buffer" BLOB NOT NULL
);
INSERT INTO "new_Img" ("buffer", "filename", "id") SELECT "buffer", "filename", "id" FROM "Img";
DROP TABLE "Img";
ALTER TABLE "new_Img" RENAME TO "Img";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
