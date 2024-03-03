"use client";
import { useUploadThing } from "@/utils/uploadthing";
import { generateClientDropzoneAccept, generatePermittedFileTypes } from "uploadthing/client";
import { Dropzone, DropzonePreview } from "./ui/dropzone";
import { useState } from "react";
import Image from "next/image";

export const CustomDropzone = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const { permittedFileInfo } = useUploadThing("imageUploader");

  const { fileTypes } = generatePermittedFileTypes(permittedFileInfo?.config);

  return (
    <Dropzone
      values={files}
      onValuesChange={(files, previews) => {
        setFiles((prev) => [...prev, ...files]);
        setPreviews((prev) => [...prev, ...previews]);
      }}
      className='border w-72 h-72'
      accept={fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined}>
      {previews.map((preview) => (
        <DropzonePreview key={preview}>
          <Image
            onLoad={() => {
              URL.revokeObjectURL(preview);
            }}
            src={preview}
            alt={preview}
            width={30}
            height={30}
          />
        </DropzonePreview>
      ))}
    </Dropzone>
  );
};
