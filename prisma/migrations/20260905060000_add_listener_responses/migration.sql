CREATE TABLE "ListenerResponse" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ListenerResponse_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ListenerResponse_submissionId_key" ON "ListenerResponse"("submissionId");
CREATE INDEX "ListenerResponse_createdAt_idx" ON "ListenerResponse"("createdAt");
