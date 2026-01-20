-- CreateTable
CREATE TABLE "ListeningRoom" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListeningRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "trackNumber" INTEGER NOT NULL,
    "releasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decayStartAt" TIMESTAMP(3),
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListeningSession" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "pseudonym" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "currentTrackId" TEXT,
    "currentPosition" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListeningSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListenTime" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "seconds" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListenTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marginalia" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" DOUBLE PRECISION NOT NULL,
    "trackId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "isArtist" BOOLEAN NOT NULL DEFAULT false,
    "artistId" TEXT,
    "parentId" TEXT,
    "lastRepliedAt" TIMESTAMP(3),
    "isFaded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Marginalia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ListeningRoom_slug_key" ON "ListeningRoom"("slug");

-- CreateIndex
CREATE INDEX "ListeningRoom_slug_idx" ON "ListeningRoom"("slug");

-- CreateIndex
CREATE INDEX "Track_roomId_trackNumber_idx" ON "Track"("roomId", "trackNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ListeningSession_sessionToken_key" ON "ListeningSession"("sessionToken");

-- CreateIndex
CREATE INDEX "ListeningSession_sessionToken_idx" ON "ListeningSession"("sessionToken");

-- CreateIndex
CREATE INDEX "ListeningSession_roomId_idx" ON "ListeningSession"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "ListenTime_sessionId_trackId_key" ON "ListenTime"("sessionId", "trackId");

-- CreateIndex
CREATE INDEX "Marginalia_trackId_timestamp_idx" ON "Marginalia"("trackId", "timestamp");

-- CreateIndex
CREATE INDEX "Marginalia_sessionId_idx" ON "Marginalia"("sessionId");

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ListeningRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListeningSession" ADD CONSTRAINT "ListeningSession_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ListeningRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListeningSession" ADD CONSTRAINT "ListeningSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListenTime" ADD CONSTRAINT "ListenTime_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ListeningSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListenTime" ADD CONSTRAINT "ListenTime_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Marginalia" ADD CONSTRAINT "Marginalia_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Marginalia" ADD CONSTRAINT "Marginalia_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ListeningSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Marginalia" ADD CONSTRAINT "Marginalia_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Marginalia"("id") ON DELETE SET NULL ON UPDATE CASCADE;
