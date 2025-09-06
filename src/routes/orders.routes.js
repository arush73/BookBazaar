import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

import { generateRazorpayOrder } from "../controllers/orders.controllers.js"

router.route("/provider/razorpay").post(generateRazorpayOrder)
// router
//   .route("/provider/paypal")
//   .post(mongoIdRequestBodyValidator("addressId"),  generatePaypalOrder)

// router
//   .route("/provider/razorpay/verify-payment")
//   .post(verifyRazorpayPaymentValidator(),  verifyRazorpayPayment)

// router
//   .route("/provider/paypal/verify-payment")
//   .post(verifyPaypalPaymentValidator(),  verifyPaypalPayment)

export default router
