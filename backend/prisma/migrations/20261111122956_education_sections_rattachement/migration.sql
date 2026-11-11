-- Migration : sections de la page Éducation (tâche 172) + rattachement France / Suisse / Commun (tâche 172D)
-- Uniquement des ajouts : aucune donnée existante n'est modifiée, toutes les nouvelles colonnes sont facultatives.

-- ── Rattachement pays (page financeurs)
CREATE TYPE "Rattachement" AS ENUM ('FRANCE', 'SUISSE', 'COMMUN');

-- ── Sections de la page Éducation & sensibilisation
CREATE TABLE "EducationSection" (
  "id" SERIAL NOT NULL,
  "slug" TEXT NOT NULL,
  "eyebrow" TEXT,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "list_title" TEXT,
  "list_items" TEXT,
  "audience" TEXT,
  "price" TEXT,
  "price_detail" TEXT,
  "pdf_url" TEXT,
  "pdf_label" TEXT,
  "field_actions_country" TEXT,
  "rattachement" "Rattachement",
  "display_order" INTEGER NOT NULL DEFAULT 0,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EducationSection_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EducationSection_slug_key" ON "EducationSection"("slug");

-- ── Cards : rattachées à une section (la card reste en base si sa section est supprimée)
ALTER TABLE "EducationItem" ADD COLUMN "section_id" INTEGER;
ALTER TABLE "EducationItem" ADD CONSTRAINT "EducationItem_section_id_fkey"
  FOREIGN KEY ("section_id") REFERENCES "EducationSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ── Rattachement sur les actions terrain et les articles
ALTER TABLE "FieldAction" ADD COLUMN "rattachement" "Rattachement";
ALTER TABLE "MediaPost" ADD COLUMN "rattachement" "Rattachement";
