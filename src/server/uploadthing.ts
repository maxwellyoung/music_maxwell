import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  userImage: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(
    async ({ file }: { file: { url: string } }) => {
      return { url: file.url };
    },
  ),

  trackAudio: f({ audio: { maxFileSize: "64MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user || session.user.role !== "admin") {
        throw new Error("Unauthorized: Admin only");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),

  roomCover: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user || session.user.role !== "admin") {
        throw new Error("Unauthorized: Admin only");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;
