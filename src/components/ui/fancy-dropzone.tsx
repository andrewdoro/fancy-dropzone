"use client";
import type { FileRejection } from "react-dropzone";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { cx } from "class-variance-authority";
import { useDropzone } from "react-dropzone";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { useUploadThing } from "@/utils/uploadthing";
import { CrossIcon, ImageIcon, PlusIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface MultiUploaderProps {
  className?: string;
  onChange: (files: File[]) => void;
}

const FancyDropzone = ({ className, onChange }: MultiUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const [previews, setPreviews] = useState<(File & { preview: string })[]>([]);
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const newFiles = acceptedFiles.slice(0, 7 - files.length);
      console.log(newFiles, files.length);
      setFiles((prev) => [...prev, ...newFiles]);
      setPreviews((prev) => [
        ...prev,
        ...newFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })),
      ]);
      onChange([...files, ...acceptedFiles]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files]
  );

  const { permittedFileInfo } = useUploadThing("imageUploader");
  const fileTypes = permittedFileInfo?.config ? Object.keys(permittedFileInfo?.config) : [];
  const filesAdded = files.length > 0;

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
    maxFiles: 7,
    multiple: true,
    noClick: filesAdded,
  });

  const removeFile = (name: string) => {
    const newFiles = files.filter((file) => file.name !== name);
    setFiles(newFiles);
    onChange(newFiles);

    setPreviews((previews) => previews.filter((file) => file.name !== name));
  };

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => previews.forEach((file) => URL.revokeObjectURL(file.preview));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cx(
        "relative flex min-h-[300px] w-full flex-col items-center justify-center gap-4 rounded-md ",
        className
      )}
      {...getRootProps()}>
      {filesAdded && open && (
        <div className='flex w-full items-center gap-2'>
          <div className='flex flex-col'>
            <p className='text-lg font-medium leading-tight'>Choose at least 3 images</p>
          </div>
          <Button type='button' onClick={open} className='ml-auto gap-2'>
            <PlusIcon />
            Add More
          </Button>
        </div>
      )}

      <input {...getInputProps()} />
      {!filesAdded && (
        <div className='flex h-[300px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border hover:bg-accent'>
          <ImageIcon className='h-10 w-10 fill-current' />
          <p className='max-w-[200px] text-center'>
            Drag & drop files here, or click to select files
          </p>
        </div>
      )}
      {isDragActive && filesAdded && (
        <div className='absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center bg-slate-300 bg-opacity-30 '>
          <ImageIcon className='h-12 w-12' />
          <p>Drop the files here ...</p>
        </div>
      )}
      {previews.length > 0 && (
        <div className='grid h-full w-full grid-cols-3 gap-4'>
          {previews.map((file, index) => (
            <div
              key={index}
              className={cn("relative h-[200px]", index === 0 && "col-span-3 h-[300px]")}>
              <Button
                className='absolute right-2 top-2 z-10 h-6 w-6'
                variant='outline'
                size='icon'
                type='button'
                onClick={() => removeFile(file.name)}>
                <CrossIcon className='h-4 w-4' />
              </Button>
              <Image
                src={file.preview}
                alt={file.name}
                fill
                onLoad={() => {
                  URL.revokeObjectURL(file.preview);
                }}
                className='h-full w-full rounded-md object-cover'
              />
            </div>
          ))}
          {filesAdded && open && previews.length < 7 && (
            <button
              onClick={open}
              className='flex h-[200px] w-full cursor-pointer items-center justify-center rounded-md border hover:bg-gray-100'>
              <PlusIcon />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FancyDropzone;
