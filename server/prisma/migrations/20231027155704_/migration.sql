/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Story` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `StorySection` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Story_id_key";

-- DropIndex
DROP INDEX "StorySection_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Story_id_key" ON "Story"("id");

-- CreateIndex
CREATE UNIQUE INDEX "StorySection_id_key" ON "StorySection"("id");
