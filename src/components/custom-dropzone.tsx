"use client";
import { useUploadThing } from "@/utils/uploadthing";
import { generateClientDropzoneAccept, generatePermittedFileTypes } from "uploadthing/client";
import { Dropzone, DropzoneEmpty, DropzonePlus, DropzonePreview } from "./ui/dropzone";
import { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { ImageIcon, PlusIcon } from "lucide-react";

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
      <DropzoneEmpty>
        <ImageIcon />

        <p>Drop your files here</p>
      </DropzoneEmpty>
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
      <DropzonePlus>
        <Button className='gap-2'>
          <PlusIcon />
          Add
        </Button>
      </DropzonePlus>
    </Dropzone>
  );
};
