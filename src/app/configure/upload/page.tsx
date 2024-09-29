'use client';
import { cn } from '@/lib/utils';
import { Image, Loader2, MousePointerSquareDashed } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Dropzone, { FileRejection } from 'react-dropzone';
import { Progress } from '@/components/ui/progress';
import { useUploadThing } from '@/lib/uploadthing';
import { useToast } from '@/hooks/use-toast';

export default function UploadPage() {
  const { toast } = useToast();
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const router = useRouter();

  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: ([data]) => {
      const configId = data.serverData.configId;
      startTransition(() => {
        router.push(`/configure/design?id=${configId}`);
      });
    },
    onUploadProgress(p) {
      setUploadProgress(p);
    },
  });

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles;

    setIsDragOver(false);
    toast({
      title: `${file.file.type} type is not suport`,
      description:
        'Please chose a (PNG, JPG, JPEG, GIF or WEBP) image instead to upload',
      variant: 'destructive',
    });
  };
  const onDropAccepted = (acceptedFiles: File[]) => {
    startUpload(acceptedFiles, { configId: undefined });

    setIsDragOver(false);
  };

  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={cn(
        'ring-grau-900/10 relative my-16 flex h-full w-full flex-1 flex-col items-center justify-center rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset lg:rounded-2xl',
        {
          'bg-blue-900/10 ring-blue-900/25': isDragOver,
        },
      )}
    >
      <div className='relative flex w-full flex-1 flex-col items-center justify-center'>
        <Dropzone
          onDropRejected={onDropRejected}
          onDropAccepted={onDropAccepted}
          accept={{
            'image/png': ['.png'],
            'image/jpg': ['.jpg'],
            'image/jpeg': ['.jpeg'],
            'image/gif': ['.gif'],
            'image/WebP': ['.WebP'],
          }}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
        >
          {({ getInputProps, getRootProps }) => (
            <div
              className='flex h-full w-full flex-1 flex-col items-center justify-center'
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragOver ? (
                <MousePointerSquareDashed className='mb-2 h-6 w-6 text-zinc-500' />
              ) : isUploading || isPending ? (
                <Loader2 className='mb-2 h-6 w-6 text-zinc-500' />
              ) : (
                <Image className='mb-2 h-6 w-6 text-zinc-500' />
              )}
              <div className='mb-2 flex flex-col justify-center text-sm text-zinc-700'>
                {isUploading ? (
                  <div className='flex flex-col items-center'>
                    <p>Uploading...</p>
                    <Progress
                      className='mt-2 h-4 w-72 bg-gray-300'
                      value={uploadProgress}
                    />
                  </div>
                ) : isPending ? (
                  <div className='flex flex-col items-center'>
                    <p>Redirecting, please wait...</p>
                  </div>
                ) : isDragOver ? (
                  <p>
                    <span className='font-semibold'>Drop file</span> to upload
                  </p>
                ) : (
                  <p>
                    <span className='font-semibold'>Click to upload</span> or
                    drag and drop!
                  </p>
                )}
              </div>

              {isPending ? null : (
                <p className='text-xs text-zinc-500'>
                  [PNG, JPG, JPEG, GIF, WEBP, ...]
                </p>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
}
