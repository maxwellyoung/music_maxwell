// Make sure to install UploadThing: pnpm add uploadthing
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  userImage: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(
    async ({ file }: { file: { url: string } }) => {
      // file.url is the uploaded image URL
      return { url: file.url };
    },
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
