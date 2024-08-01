/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Domain` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Domain_userId_key" ON "Domain"("userId");
