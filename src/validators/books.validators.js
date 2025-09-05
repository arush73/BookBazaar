import { z } from zod

export const addBookSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title is too long"),
  author: z
    .string()
    .min(1, "Author name is required")
    .max(100, "Author name is too long"),
  description: z
    .string()
    .max(2000, "Description too long")
    .optional(),
  price: z
    .number()
    .min(0, "Price must be non-negative"),
  stock: z
    .number()
    .min(0, "Stock must be non-negative")
    .default(0),
 
});

export {
    addBookSchema
}
