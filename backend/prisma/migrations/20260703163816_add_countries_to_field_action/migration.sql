/*
  Warnings:

  - You are about to drop the column `country` on the `FieldAction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FieldAction" DROP COLUMN "country";

-- CreateTable
CREATE TABLE "FieldActionCountry" (
    "id" SERIAL NOT NULL,
    "action_id" INTEGER NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "FieldActionCountry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FieldActionCountry" ADD CONSTRAINT "FieldActionCountry_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "FieldAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
