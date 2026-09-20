-- Renomme les colonnes hero existantes (aucune perte de données)
ALTER TABLE "Mission" RENAME COLUMN "image_url" TO "photo_hero_url";
ALTER TABLE "Mission" RENAME COLUMN "image_alt" TO "photo_hero_alt";

-- Nouvelles colonnes pour la photo de la section "La mission"
ALTER TABLE "Mission" ADD COLUMN "photo_section_url" TEXT;
ALTER TABLE "Mission" ADD COLUMN "photo_section_alt" TEXT;

-- Case "forcer l'affichage" pour la future galerie
ALTER TABLE "Media" ADD COLUMN "force_display" BOOLEAN NOT NULL DEFAULT false;
