-- Auteur et nom du média source pour les publications Médias & actualités
ALTER TABLE "MediaPost" ADD COLUMN "author" TEXT;
ALTER TABLE "MediaPost" ADD COLUMN "source" TEXT;
