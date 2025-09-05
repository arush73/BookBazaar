import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import Razorpay from "razorpay";

let razorpayInstance

try {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
} catch (error) {
  console.error("RAZORPAY ERROR: ", error)
}

const generateRazorpayOrder = asyncHandler(async (req, res) => {
  const { addressId } = req.body

  if (!razorpayInstance) {
    console.error("RAZORPAY ERROR: `key_id` is mandatory")
    throw new ApiError(500, "Internal server error")
  }

  // Check if address is valid and is of logged in user's
  const address = await Address.findOne({
    _id: addressId,
    owner: req.user._id,
  })

  if (!address) {
    throw new ApiError(404, "Address does not exists")
  }

  const cart = await Cart.findOne({
    owner: req.user._id,
  })

  if (!cart || !cart.items?.length) {
    throw new ApiError(400, "User cart is empty")
  }
  const orderItems = cart.items
  const userCart = await getCart(req.user._id)

  // note down th total cart value and cart value after the discount
  // If no coupon is applied the total and discounted prices will be the same
  const totalPrice = userCart.cartTotal
  const totalDiscountedPrice = userCart.discountedTotal

  const orderOptions = {
    amount: parseInt(totalDiscountedPrice) * 100, // in paisa
    currency: "INR", // Might accept from client
    receipt: nanoid(10),
  }

  razorpayInstance.orders.create(
    orderOptions,
    async function (err, razorpayOrder) {
      if (!razorpayOrder || (err && err.error)) {
        // Throwing ApiError here will not trigger the error handler middleware
        return res
          .status(err.statusCode)
          .json(
            new ApiResponse(
              err.statusCode,
              null,
              err.error.reason ||
                "Something went wrong while initialising the razorpay order."
            )
          )
      }

      const { addressLine1, addressLine2, city, country, pincode, state } =
        address

      // Create an order while we generate razorpay session
      // In case payment is done and there is some network issue in the payment verification api
      // We will at least have a record of the order
      const unpaidOrder = await EcomOrder.create({
        address: {
          addressLine1,
          addressLine2,
          city,
          country,
          pincode,
          state,
        },
        customer: req.user._id,
        items: orderItems,
        orderPrice: totalPrice ?? 0,
        discountedOrderPrice: totalDiscountedPrice ?? 0,
        paymentProvider: PaymentProviderEnum.RAZORPAY,
        paymentId: razorpayOrder.id,
        coupon: userCart.coupon?._id,
      })
      if (unpaidOrder) {
        // if order is created then only proceed with the payment
        return res
          .status(200)
          .json(new ApiResponse(200, razorpayOrder, "Razorpay order generated"))
      } else {
        return res
          .status(500)
          .json(
            new ApiResponse(
              500,
              null,
              "Something went wrong while initialising the razorpay order."
            )
          )
      }
    }
  )
})