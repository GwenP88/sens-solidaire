/*
  Warnings:

  - Made the column `short_description` on table `Mission` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Mission" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "short_description" SET NOT NULL;
