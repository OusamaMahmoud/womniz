import { z } from "zod";

const NewProductSchema = z.object({
  name_en: z.string().min(1, "Product Name is at least 1 characters."),
  name_ar: z.string().min(1, "Product Name is at least 1 characters."),
  desc_en: z.string().min(1, "Description is at least 1 characters."),
  desc_ar: z.string().min(1, "Description is at least 1 characters."),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price must be greater than or equal to 0"),
  discount: z
    .number({ invalid_type_error: "Discount must be a number" })
    .min(0)
    .max(100, "Discount must be between 0 and 100"),
  model: z.string().min(1, "Model must be at least 1 characters."),
  brand: z.string().min(1, "brand must be at least 1 characters."),
  sellerSKU: z.string().min(1, "Seller SKU must be at least 1 characters."),
  stock: z
    .number({ invalid_type_error: "Stock must be a number" })
    .min(0, "Stock must be greater than or equal to 0"),

  thumbnail: z.instanceof(FileList).refine((fileList) => fileList.length > 0, {
    message: "Please Provide Thumbnail image!",
  }),
});

export type NewProductFormData = z.infer<typeof NewProductSchema>;

export default NewProductSchema;
