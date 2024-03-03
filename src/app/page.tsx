import { CustomDropzone } from "@/components/custom-dropzone";
import { UploadDropzone } from "@uploadthing/react";

export default function Home() {
  return (
    <main className='w-full max-w-md mx-auto flex flex-col '>
      <div>
        <h1 className='text-4xl font-bold tracking-tight'>Fancy Dropzone </h1>
      </div>
      <CustomDropzone />
    </main>
  );
}
