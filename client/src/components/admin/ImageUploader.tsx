import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

type ImageUploaderProps = {
  onImageUpload: (imageUrl: string) => void;
};

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploading(true);
    try {
      const uploads = await Promise.all(
        acceptedFiles.map(async (file) => {
          // In a real implementation, you would upload to a server
          // Here we're just creating an object URL as a simulation
          const fileName = `${uuidv4()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;
          
          // For a real implementation, use the following approach:
          // const formData = new FormData();
          // formData.append('file', file);
          // const response = await fetch('/api/admin/images', {
          //   method: 'POST',
          //   body: formData,
          // });
          // const data = await response.json();
          // return data.path;
          
          // Simulated upload - just creates an object URL
          return URL.createObjectURL(file);
        })
      );
      
      setUploadedImages((prev) => [...prev, ...uploads]);
      
      // If the callback is provided, send the first image URL to the parent
      if (uploads.length > 0 && onImageUpload) {
        onImageUpload(uploads[0]);
      }
      
      toast({
        title: 'Upload successful',
        description: `${uploads.length} image${uploads.length > 1 ? 's' : ''} uploaded successfully.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'There was an error uploading your image(s).',
      });
    } finally {
      setIsUploading(false);
    }
  }, [onImageUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 5,
  });
  
  const removeImage = (imageUrl: string) => {
    setUploadedImages(uploadedImages.filter(url => url !== imageUrl));
    
    // If it's an object URL, revoke it to avoid memory leaks
    if (imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-12 w-12 text-gray-400" />
          {isDragActive ? (
            <p className="text-primary font-medium">Drop the files here...</p>
          ) : (
            <>
              <p className="font-medium">Drag and drop images here, or click to select files</p>
              <p className="text-sm text-gray-500">Supports: JPEG, PNG, GIF, WebP (Max: 5 files)</p>
            </>
          )}
        </div>
      </div>
      
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Images ({uploadedImages.length})</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedImages.map((imageUrl, index) => (
              <Card key={index} className="overflow-hidden group relative">
                <CardContent className="p-0">
                  <img 
                    src={imageUrl} 
                    alt={`Uploaded ${index + 1}`} 
                    className="w-full h-32 object-cover"
                  />
                  <Button
                    size="icon"
                    variant="destructive" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(imageUrl);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      navigator.clipboard.writeText(imageUrl);
                      toast({
                        title: "Copied!",
                        description: "Image URL copied to clipboard",
                      });
                    }}
                  >
                    Copy URL
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}