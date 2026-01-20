import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { ourFileRouter } from "~/server/uploadthing";

type OurFileRouter = typeof ourFileRouter;

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
