import { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ImageUploader from './ImageUploader';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type ContentEditorProps = {
  initialValue: string;
  onSave: (content: string) => Promise<void>;
};

export default function ContentEditor({ initialValue, onSave }: ContentEditorProps) {
  const [content, setContent] = useState(initialValue);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<any>(null);
  const { toast } = useToast();

  const handleImageUpload = (imageUrl: string) => {
    // Insert the image at the current cursor position in the editor
    if (editorRef.current) {
      const editor = editorRef.current;
      editor.execCommand('mceInsertContent', false, `<img src="${imageUrl}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`);
    }
    // Close the uploader dialog
    setIsUploaderOpen(false);
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Content cannot be empty',
      });
      return;
    }

    setIsSaving(true);
    try {
      await onSave(content);
      toast({
        title: 'Saved',
        description: 'Content saved successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save content',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Edit Content</h3>
        <div className="flex gap-2">
          <Dialog open={isUploaderOpen} onOpenChange={setIsUploaderOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Image</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Upload Images</DialogTitle>
                <DialogDescription>
                  Upload images to use in your content. They will be inserted at your cursor position.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <ImageUploader onImageUpload={handleImageUpload} />
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Editor
        apiKey="no-api-key"
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue={initialValue}
        value={content}
        onEditorChange={(newContent) => setContent(newContent)}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px }',
          branding: false,
          resize: true,
          statusbar: true,
        }}
      />
    </div>
  );
}