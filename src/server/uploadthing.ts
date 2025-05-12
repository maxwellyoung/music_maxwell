import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  userImage: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(
    async ({ file }: { file: { url: string } }) => {
      return { url: file.url };
    },
  ),
} satisfies FileRouter;
