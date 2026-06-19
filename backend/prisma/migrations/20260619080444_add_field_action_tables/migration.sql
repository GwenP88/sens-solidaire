-- CreateTable
CREATE TABLE "FieldAction" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "country" TEXT NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "FieldAction_slug_key" ON "FieldAction"("slug");

-- AddForeignKey
ALTER TABLE "FieldActionTag" ADD CONSTRAINT "FieldActionTag_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "FieldAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldActionODD" ADD CONSTRAINT "FieldActionODD_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "FieldAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
