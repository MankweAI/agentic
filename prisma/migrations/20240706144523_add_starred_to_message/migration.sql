-- AlterTable
ALTER TABLE "ChatMessage" ALTER COLUMN "starred" DROP DEFAULT,
ALTER COLUMN "starred" SET DATA TYPE TEXT;