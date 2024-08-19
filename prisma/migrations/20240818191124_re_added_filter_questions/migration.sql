-- CreateTable
CREATE TABLE "FilterQuestions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "question" TEXT NOT NULL,
    "answered" TEXT,
    "domainId" UUID,

    CONSTRAINT "FilterQuestions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FilterQuestions" ADD CONSTRAINT "FilterQuestions_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;
