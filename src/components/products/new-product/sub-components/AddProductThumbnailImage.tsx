import { ImageDownIcon } from "lucide-react";
import { ChangeEvent, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { NewProductFormData } from "../../../validation-schems/products/new-product-schema";

interface AddProductThumbnailImageProps {
  control: Control<NewProductFormData>;
  errors: FieldErrors<NewProductFormData>;
  register: UseFormRegister<NewProductFormData>;
  onThumbnailImage: (img: File) => void;
}

const AddProductThumbnailImage = ({
  control,
  errors,
  onThumbnailImage,
}: AddProductThumbnailImageProps) => {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const handleProductThumbnailImage = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (value: File | null) => void
  ) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        onChange(null);
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        onChange(null);
        return;
      }

      // Set preview
      const thumbnailPreview = URL.createObjectURL(file);
      setThumbnailPreview(thumbnailPreview);
      
      // Update form value and call the callback
      onChange(file);
      onThumbnailImage(file);
    }
  };

  return (
    <div className="max-w-fit mb-8">
      <Controller
        name="thumbnail"
        control={control}
        rules={{
          required: "Thumbnail image is required",
          validate: {
            isImage: (file) => 
              !file || file.type.startsWith('image/') || 
              "File must be an image",
            maxSize: (file) =>
              !file || file.size <= 5 * 1024 * 1024 ||
              "Image must be less than 5MB",
          }
        }}
        render={({ field: { onChange, value, ...field } }) => (
          <div className="space-y-4">
            <label className="block">
              <span className="flex font-medium gap-2 p-3 cursor-pointer bg-slate-50 hover:bg-slate-100 rounded-md transition-colors">
                {value ? 'Change Thumbnail Image' : 'Add Thumbnail Image'} <ImageDownIcon />
              </span>
              <input
                {...field}
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleProductThumbnailImage(e, onChange)}
              />
            </label>

            {thumbnailPreview && (
              <div className="relative group">
                <div className="border rounded-md overflow-hidden">
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview" 
                    className="w-72 h-auto object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    className="text-white hover:text-red-400 transition-colors"
                    onClick={() => {
                      setThumbnailPreview(null);
                      onChange(null);
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            )}

            {errors.thumbnail && (
              <p className="text-red-500 text-sm mt-1">
                {errors.thumbnail.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default AddProductThumbnailImage;