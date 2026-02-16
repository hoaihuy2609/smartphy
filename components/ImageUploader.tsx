
import React, { useState } from 'react';

interface ImageItem {
  id: string;
  base64: string;
  mimeType: string;
  preview: string;
}

interface ImageUploaderProps {
  onImagesChange: (images: { base64: string, mimeType: string }[]) => void;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesChange, disabled }) => {
  const [images, setImages] = useState<ImageItem[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Explicitly cast the Array.from result to File[] to fix 'unknown' type errors in the map function
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    // Limit to 5 images total
    const remainingSlots = 5 - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    const promises = filesToProcess.map(file => {
      return new Promise<ImageItem>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve({
            id: Math.random().toString(36).substring(2, 11),
            base64: result.split(',')[1],
            // 'file' is now correctly inferred as 'File' which has the 'type' property
            mimeType: file.type,
            preview: result
          });
        };
        // 'file' is now correctly inferred as 'File' which is assignable to 'Blob'
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(newImages => {
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesChange(updatedImages.map(img => ({ base64: img.base64, mimeType: img.mimeType })));
    });
    
    // Reset input so same file can be selected again if deleted
    e.target.value = '';
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    onImagesChange(updatedImages.map(img => ({ base64: img.base64, mimeType: img.mimeType })));
  };

  return (
    <div className="w-full">
      <div className={`relative border-2 border-dashed border-slate-300 rounded-2xl p-6 transition-all bg-white group ${images.length < 5 && !disabled ? 'hover:border-indigo-400' : ''}`}>
        {images.length < 5 && (
          <>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
              disabled={disabled}
            />
            <div className="flex flex-col items-center justify-center gap-2 text-center py-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div>
                <p className="text-base font-semibold text-slate-700">Tải ảnh đề bài lên ({images.length}/5)</p>
                <p className="text-xs text-slate-500 mt-1">Hỗ trợ tối đa 5 ảnh cùng lúc</p>
              </div>
            </div>
          </>
        )}

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4 relative z-20">
            {images.map((img) => (
              <div key={img.id} className="relative group/item aspect-square">
                <img src={img.preview} alt="Preview" className="w-full h-full object-cover rounded-lg shadow-sm border border-slate-200" />
                {!disabled && (
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
