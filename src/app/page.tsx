import { CustomDropzone } from "@/components/custom-dropzone";
import { ThemeToggle } from "@/components/theme-toggle";
import { UploadDropzone } from "@uploadthing/react";

export default function Home() {
  return (
    <main className='w-full max-w-2xl mx-auto flex flex-col gap-8  py-8'>
      <div className='flex justify-between'>
        <h1 className='text-4xl font-bold tracking-tight'>Fancy Dropzone </h1>
        <ThemeToggle />
      </div>
      <CustomDropzone />
    </main>
  );
}
