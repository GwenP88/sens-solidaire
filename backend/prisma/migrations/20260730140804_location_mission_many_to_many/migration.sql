/*
  Warnings:

  - You are about to drop the column `mission_id` on the `Location` table. All the data in the column will be lost.

*/

-- CreateTable
CREATE TABLE "_LocationToMission" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_LocationToMission_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LocationToMission_B_index" ON "_LocationToMission"("B");

-- AddForeignKey
ALTER TABLE "_LocationToMission" ADD CONSTRAINT "_LocationToMission_A_fkey" FOREIGN KEY ("A") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationToMission" ADD CONSTRAINT "_LocationToMission_B_fkey" FOREIGN KEY ("B") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CopyData (ajouté à la main : reprend le lien existant mission_id → nouvelle table de jointure)
INSERT INTO "_LocationToMission" ("A", "B")
SELECT "id", "mission_id" FROM "Location" WHERE "mission_id" IS NOT NULL;

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_mission_id_fkey";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "mission_id";