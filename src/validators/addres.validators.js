import { z } from "zod"

const createAddressSchema = z.object({
  addressLine1: z
    .string()
    .min(5, "Address Line 1 must be at least 5 characters long.")
    .max(100, "Address Line 1 must not exceed 100 characters."),

  addressLine2: z
    .string()
    .max(100, "Address Line 2 must not exceed 100 characters.")
    .optional()
    .or(z.literal("")), // allow empty string

  pincode: z
    .string()
    .regex(
      /^[1-9][0-9]{5}$/,
      "Pincode must be a valid 6-digit Indian pincode."
    ),

  city: z
    .string()
    .min(2, "City name must be at least 2 characters.")
    .max(50, "City name must not exceed 50 characters."),

  state: z
    .string()
    .min(2, "State must be at least 2 characters.")
    .max(50, "State must not exceed 50 characters."),

  country: z
    .string()
    .min(2, "Country must be at least 2 characters.")
    .max(50, "Country must not exceed 50 characters.")
    .default("India"),
})

export { createAddressSchema }
