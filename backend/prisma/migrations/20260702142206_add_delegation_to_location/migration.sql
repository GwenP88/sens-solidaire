-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "delegation_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_delegation_id_fkey" FOREIGN KEY ("delegation_id") REFERENCES "Delegation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
