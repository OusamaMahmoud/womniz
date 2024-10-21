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
  model: z.string().min(3, "Model must be at least 3 characters."),
  sellerSKU: z.string().min(3, "Seller SKU must be at least 3 characters."),
  stock: z
    .number({ invalid_type_error: "Stock must be a number" })
    .min(0, "Stock must be greater than or equal to 0"),
  variants: z.union([
    z.array(
      z.object({
        size_id: z.string().min(1, "Size must be at least 3 characters."),
        color_id: z.string().min(1, "Color must be at least 3 characters."),
        sku: z.string().min(1, "SKU must be at least 1 characters"),
        stock: z.number({ invalid_type_error: "Stock must be a number" }),
        price: z.number({ invalid_type_error: "Price must be a number" }),
        discount: z.number({ invalid_type_error: "Discount must be a number" }),
      })
    ),
    z.null(),
  ]),
  specifications: z.union([
    z.array(
      z.object({
        name_en: z.string().min(3),
        name_ar: z.string().min(3),
        value_en: z.string().min(3),
        value_ar: z.string().min(3),
      })
    ),
    z.null(),
  ]),
  thumbnail: z.instanceof(FileList).refine((fileList) => fileList.length > 0, {
    message: "Please Provide Thumbnail image!",
  }),
  categories: z
    .array(
      z.object({
        mainCategory: z.object(
          {
            label: z.string().min(1, "Main category name is required"),
            value: z.number({ required_error: "Main category is required" }),
          },
          { message: "Main category is required" }
        ),
        subCategories: z
          .array(
            z.object({
              label: z.string().min(1, "Sub-category name is required"),
              value: z.number({
                invalid_type_error: "Sub-category is required",
              }),
            })
          )
          .min(1, { message: "At least one sub-category must be selected" }),
        brand: z.object(
          {
            label: z.string().min(1, "Brand name is required"),
            value: z.number({ invalid_type_error: "Brand is required" }),
          },
          { message: "Main category is required" }
        ),
        subBrands: z
          .array(
            z.object({
              label: z.string().min(1, "Sub-brand name is required"),
              value: z.number({ invalid_type_error: "Sub-brand is required" }),
            })
          )
          .min(1, { message: "At least one sub-category must be selected" }),
      })
    )
    .min(1, "At least one category must be added"),
});

export type NewProductFormData = z.infer<typeof NewProductSchema>;

export default NewProductSchema;
