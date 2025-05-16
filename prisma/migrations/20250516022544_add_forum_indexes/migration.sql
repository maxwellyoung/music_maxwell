-- CreateIndex
CREATE INDEX "Reply_createdAt_idx" ON "Reply"("createdAt");

-- CreateIndex
CREATE INDEX "Reply_topicId_idx" ON "Reply"("topicId");

-- CreateIndex
CREATE INDEX "Topic_createdAt_idx" ON "Topic"("createdAt");

-- CreateIndex
CREATE INDEX "Topic_authorId_idx" ON "Topic"("authorId");
