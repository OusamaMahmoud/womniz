import { ImageDownIcon } from "lucide-react";
import { ChangeEvent} from "react";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { NewProductFormData } from "../../../../validation-schems/products/new-product-schema";

interface AddProductThumbnailImageProps {
  control: Control<NewProductFormData>;
  errors: FieldErrors<NewProductFormData>;
  register: UseFormRegister<NewProductFormData>;
  onThumbnailPreview: (preview: string | null) => void;
  thumbnailPreview: string | null;
}

const ChangeProductThumbnailImage = ({
  register,
  errors,
  onThumbnailPreview,
  thumbnailPreview,
}: AddProductThumbnailImageProps) => {
  const handleProductThumbnailImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const thumbnailPreview = URL.createObjectURL(file);
      onThumbnailPreview(thumbnailPreview);
    }
  };

  return (
    <div className="max-w-fit mb-8">
      <div className="space-y-4">
        <label className="block">
          <span className="flex items-center gap-2 mb-4 text-lg font-semibold">
           Change Thumbnail Image
            <ImageDownIcon />
          </span>
          <input
            className="file-input"
            {...register("thumbnail")}
            type="file"
            accept="image/*"
            onChange={(e) => {
              handleProductThumbnailImage(e);
            }}
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
          </div>
        )}

        {errors.thumbnail && (
          <p className="text-red-500 text-sm mt-1">
            {errors?.thumbnail?.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChangeProductThumbnailImage;
