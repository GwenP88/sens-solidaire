-- Migration : simplification des sections Éducation (retours de Gwen du 11/11/2026)
-- La table "EducationSection" est vide au moment de la migration : aucune donnée perdue.
--   - liste à puces : remplacée par la mise en forme du texte de présentation (« - » = puce)
--   - document PDF : remplacé par les boutons (un bouton peut mener à un document importé)
--   - carrousel de projets réalisés : retiré
--   - tarif : en euros (page /france) ET en francs suisses (page /suisse)

ALTER TABLE "EducationSection" DROP COLUMN "list_title";
ALTER TABLE "EducationSection" DROP COLUMN "list_items";
ALTER TABLE "EducationSection" DROP COLUMN "pdf_url";
ALTER TABLE "EducationSection" DROP COLUMN "pdf_label";
ALTER TABLE "EducationSection" DROP COLUMN "field_actions_country";

ALTER TABLE "EducationSection" RENAME COLUMN "price" TO "price_eur";
ALTER TABLE "EducationSection" ADD COLUMN "price_chf" TEXT;
