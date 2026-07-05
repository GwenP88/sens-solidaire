-- AlterTable
ALTER TABLE "MissionReport" ADD COLUMN     "mission_id" INTEGER;

-- AddForeignKey
ALTER TABLE "MissionReport" ADD CONSTRAINT "MissionReport_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "Mission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
