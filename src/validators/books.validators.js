import { z } from "zod"

const addBookSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  author: z
    .string()
    .min(1, "Author name is required")
    .max(100, "Author name is too long"),
  description: z.string().max(2000, "Description too long").optional(),
  price: z.preprocess((val) => Number(val), z.number().nonnegative()),
  stock: z.preprocess((val) => Number(val), z.number().int().nonnegative()),
})

export { addBookSchema }
