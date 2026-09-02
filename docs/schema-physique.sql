-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Mission" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "country_preposition" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "volunteer_role" TEXT,
    "programme" TEXT,
    "included" TEXT,
    "not_include" TEXT,
    "admin_info" TEXT,
    "ministry_url" TEXT,
    "health_info" TEXT,
    "helloasso_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'volontariat_individuel',
    "short_description" TEXT NOT NULL,
    "image_url" TEXT,
    "image_alt" TEXT,
    "how_to_go" TEXT,
    "age_min" TEXT,
    "age_max" TEXT,
    "duration_label" TEXT,
    "role_france" TEXT,
    "role_etranger" TEXT,
    "candidater_url" TEXT,
    "info_service_civique_url" TEXT,
    "competences" TEXT,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionPricing" (
    "id" SERIAL NOT NULL,
    "mission_id" INTEGER NOT NULL,
    "duration_label" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "display_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MissionPricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT,
    "map_url" TEXT,
    "website_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "delegation_id" INTEGER,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" SERIAL NOT NULL,
    "mission_id" INTEGER,
    "author_name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "avatar_url" TEXT,
    "annee" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "show_homepage" BOOLEAN NOT NULL DEFAULT false,
    "consent_given" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionReport" (
    "id" SERIAL NOT NULL,
    "auteur" TEXT NOT NULL,
    "destination" TEXT,
    "type" TEXT NOT NULL,
    "annee" INTEGER NOT NULL,
    "pdf_url" TEXT NOT NULL,
    "mission_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MissionReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "refresh_token_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "label" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldAction" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FieldAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldActionTag" (
    "id" SERIAL NOT NULL,
    "action_id" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "FieldActionTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldActionODD" (
    "id" SERIAL NOT NULL,
    "action_id" INTEGER NOT NULL,
    "odd_number" INTEGER NOT NULL,

    CONSTRAINT "FieldActionODD_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldActionCountry" (
    "id" SERIAL NOT NULL,
    "action_id" INTEGER NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "FieldActionCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaPost" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "theme" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "image_url" TEXT,
    "external_url" TEXT,
    "show_homepage" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationItem" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "type" TEXT NOT NULL,
    "public" TEXT NOT NULL,
    "image_url" TEXT,
    "external_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityReport" (
    "id" SERIAL NOT NULL,
    "annee" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT,
    "avatar_url" TEXT,
    "category" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delegation" (
    "id" SERIAL NOT NULL,
    "pays" TEXT NOT NULL,
    "flag_code" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "lieu" TEXT NOT NULL,
    "contacts" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delegation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logo_url" TEXT,
    "website_url" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LocationToMission" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_LocationToMission_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mission_slug_key" ON "Mission"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Location_slug_key" ON "Location"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FieldAction_slug_key" ON "FieldAction"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MediaPost_slug_key" ON "MediaPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EducationItem_slug_key" ON "EducationItem"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityReport_annee_key" ON "ActivityReport"("annee");

-- CreateIndex
CREATE INDEX "_LocationToMission_B_index" ON "_LocationToMission"("B");

-- AddForeignKey
ALTER TABLE "MissionPricing" ADD CONSTRAINT "MissionPricing_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_delegation_id_fkey" FOREIGN KEY ("delegation_id") REFERENCES "Delegation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "Mission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionReport" ADD CONSTRAINT "MissionReport_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "Mission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldActionTag" ADD CONSTRAINT "FieldActionTag_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "FieldAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldActionODD" ADD CONSTRAINT "FieldActionODD_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "FieldAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldActionCountry" ADD CONSTRAINT "FieldActionCountry_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "FieldAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationToMission" ADD CONSTRAINT "_LocationToMission_A_fkey" FOREIGN KEY ("A") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationToMission" ADD CONSTRAINT "_LocationToMission_B_fkey" FOREIGN KEY ("B") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

