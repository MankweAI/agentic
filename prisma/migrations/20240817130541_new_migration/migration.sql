/*
  Warnings:

  - You are about to drop the `FilterQuestions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FilterQuestions" DROP CONSTRAINT "FilterQuestions_domainId_fkey";

-- AlterTable
ALTER TABLE "Domain" ADD COLUMN     "trainingData" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "FilterQuestions";
