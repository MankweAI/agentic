/*
  Warnings:

  - The `starred` column on the `ChatMessage` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ChatMessage" DROP COLUMN "starred",
ADD COLUMN     "starred" BOOLEAN NOT NULL DEFAULT false;
