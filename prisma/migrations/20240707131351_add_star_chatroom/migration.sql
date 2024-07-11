/*
  Warnings:

  - You are about to drop the column `deleted` on the `ChatMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChatMessage" DROP COLUMN "deleted";

-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "starred" BOOLEAN NOT NULL DEFAULT false;
