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

const addReviewSchema = z.object({
  rating: z.preprocess(
    (val) => (val !== undefined ? Number(val) : undefined),
    z
      .number({
        required_error: "Rating is required",
        invalid_type_error: "Rating must be a number",
      })
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot be more than 5")
  ),

  comment: z
    .string({
      required_error: "Comment is required",
    })
    .min(1, "Comment cannot be empty")
    .max(500, "Comment is too long"),
})

export { addBookSchema, addReviewSchema }
