"use client";
import type { Accept, DropzoneState, FileRejection, FileWithPath } from "react-dropzone";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";

import { CrossIcon, ImageIcon, PlusIcon } from "lucide-react";
import { Button } from "./button";

interface DropzoneContextProps {
  open: () => void;
  onRemoveFile: (name: string) => void;
}
const DropzoneContext = createContext<DropzoneContextProps>({} as MultiUploaderProps);

export const useDropzoneContext = () => {
  return useContext(DropzoneContext);
};

interface DropzoneProps {
  accept?: Accept;
  values: File[];
  onValuesChange: (files: File[], previews: string[]) => void;
  children: React.ReactNode;
  className: string;
}
export const Dropzone = ({
  accept,
  values,
  children,
  onValuesChange,
  className,
}: DropzoneProps) => {
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const previews = acceptedFiles.map((file) => URL.createObjectURL(file));
      onValuesChange(acceptedFiles, previews);
    },
    [onValuesChange]
  );

  const onRemoveFile = (name: string) => {
    const newFiles = values?.filter((file) => file.name !== name);
    const previews = values.map((file) => URL.createObjectURL(file));

    onValuesChange(newFiles, previews);
  };

  const props = useDropzone({
    onDrop,
    accept,
  });

  return (
    <DropzoneContext.Provider
      value={{
        onRemoveFile,
        open: props.open,
      }}>
      <div {...props.getRootProps()} className={className}>
        <input {...props.getInputProps()} />

        {children}
      </div>
    </DropzoneContext.Provider>
  );
};

export const DropzoneEmpty = () => {
  return (
    <div>
      <ImageIcon />
      <p>Drag & drop files here, or click to select files</p>
    </div>
  );
};

export const DropzoneDragging = () => {
  return (
    <div className='absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center  bg-opacity-30 '>
      <ImageIcon className='h-12 w-12' />
      <p>Drop the files here ...</p>
    </div>
  );
};

export const DropzonePreview = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export const DropzonePreviewRemove = ({ file }: { file: File }) => {
  const { onRemoveFile } = useDropzoneContext();
  return (
    <Button onClick={() => onRemoveFile(file.name)}>
      <CrossIcon />
    </Button>
  );
};

export const DropzonePlus = () => {
  const { open } = useDropzoneContext();
  return (
    <Button onClick={open}>
      <PlusIcon />
    </Button>
  );
};
