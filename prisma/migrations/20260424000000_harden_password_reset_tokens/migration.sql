-- AlterTable
ALTER TABLE "PasswordResetToken" ADD COLUMN "tokenSelector" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenSelector_key" ON "PasswordResetToken"("tokenSelector");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_userId_key" ON "PasswordResetToken"("userId");
