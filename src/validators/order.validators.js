import { z } from "zod"

const verifyRazorpayPaymentSchema = z.object({
  razorpay_order_id: z
    .string({
      required_error: "Razorpay order id is missing",
      invalid_type_error: "Razorpay order id must be a string",
    })
    .trim()
    .min(1, "Razorpay order id is missing"),

  razorpay_payment_id: z
    .string({
      required_error: "Razorpay payment id is missing",
      invalid_type_error: "Razorpay payment id must be a string",
    })
    .trim()
    .min(1, "Razorpay payment id is missing"),

  razorpay_signature: z
    .string({
      required_error: "Razorpay signature is missing",
      invalid_type_error: "Razorpay signature must be a string",
    })
    .trim()
    .min(1, "Razorpay signature is missing"),
})

export { verifyRazorpayPaymentSchema }
