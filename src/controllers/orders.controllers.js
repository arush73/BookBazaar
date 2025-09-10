import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import Razorpay from "razorpay"
import Address from "../models/address.models.js"
import Cart from "../models/cart.models.js"
import Order from "../models/orders.models.js"
import Book from "../models/books.models.js"
import crypto from "crypto"
import { verifyRazorpayPaymentSchema } from "../validators/order.validators.js"
import { sendMail, orderConfirmationMailgenContent } from "../utils/mail.js"
import { OrderStatusEnum, PaymentProviderEnum } from "../constants.js"
import { getCart } from "./cart.controllers.js"
import { nanoid } from "nanoid"

// could add paypal api later

let razorpayInstance

try {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
} catch (error) {
  console.error("RAZORPAY ERROR: ", error)
}

const orderFulfillmentHelper = async (orderPaymentId, req) => {
  const order = await Order.findOneAndUpdate(
    {
      paymentId: orderPaymentId,
    },
    {
      $set: {
        isPaymentDone: true,
      },
    },
    { new: true }
  )

  if (!order) {
    throw new ApiError(404, "Order does not exist")
  }

  const cart = await Cart.findOne({
    owner: req.user._id,
  })

  const userCart = await getCart(req.user._id)

  let bulkStockUpdates = userCart.items.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.book?._id },
        update: { $inc: { stock: -item.quantity } }, y
      },
    }
  })

  await Book.bulkWrite(bulkStockUpdates, {
    skipValidation: true,
  })

  await sendMail({
    email: req.user?.email,
    subject: "Order confirmed",
    mailgenContent: orderConfirmationMailgenContent(
      req.user?.username,
      userCart.items,
      order.discountedOrderPrice ?? 0
    ),
  })

  cart.items = []
  cart.coupon = null

  await cart.save({ validateBeforeSave: false })
  return order
}

const generateRazorpayOrder = asyncHandler(async (req, res) => {
  const { addressId } = req.body

  if (!razorpayInstance) {
    console.error("RAZORPAY ERROR: `key_id` is mandatory")
    throw new ApiError(500, "Internal server error")
  }

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

  const totalPrice = userCart.cartTotal
  const totalDiscountedPrice = userCart.discountedTotal

  const orderOptions = {
    amount: parseInt(totalDiscountedPrice) * 100, // in paisa
    currency: "INR",
    receipt: nanoid(10),
  }

  razorpayInstance.orders.create(
    orderOptions,
    async function (err, razorpayOrder) {
      if (!razorpayOrder || (err && err.error)) {
        console.log("func if enter")
        return res
          .status(500)
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

      const unpaidOrder = await Order.create({
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

const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const validate = verifyRazorpayPaymentSchema.safeParse(req.body)
  if (!validate.success) {
    throw new ApiError(
      400,
      validate.error.issues.map((mess) => mess.message)
    )
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body

  let body = razorpay_order_id + "|" + razorpay_payment_id

  let expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    const order = await orderFulfillmentHelper(razorpay_order_id, req)
    return res
      .status(201)
      .json(new ApiResponse(201,  "Order placed successfully",order))
  } else {
    throw new ApiError(400, "Invalid razorpay signature")
  }
})

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params
  const { status } = req.body

  let order = await Order.findById(orderId)

  if (!order) {
    throw new ApiError(404, "Order does not exist")
  }

  if (order.status === OrderStatusEnum.DELIVERED) {
    throw new ApiError(400, "Order is already delivered")
  }

  order = await Order.findByIdAndUpdate(
    orderId,
    {
      $set: {
        status,
      },
    },
    { new: true }
  )
  return res.status(200).json(
    new ApiResponse(200, "Order status changed successfully", {
      status,
    })
  )
})

const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params
  if (!orderId) throw new ApiError(400, "orderId not found in the params")

  const order = await Order.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(orderId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        customer: { $first: "$customer" },
      },
    },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "books",
        localField: "items.bookId",
        foreignField: "_id",
        as: "items.book", 
      },
    },
    { $addFields: { "items.book": { $first: "$items.book" } } },
    {
      $group: {
        _id: "$_id",
        order: { $first: "$$ROOT" }, 
        orderItems: {
          $push: {
            _id: "$items._id",
            quantity: "$items.quantity",
            product: "$items.book",
          },
        },
      },
    },
    {
      $addFields: {
        "order.items": "$orderItems",
      },
    },
    {
      $project: {
        orderItems: 0,
      },
    },
  ])

  if (!order[0]) {
    throw new ApiError(404, "Order does not exist")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order[0], "Order fetched successfully"))
})

const getOrderListAdmin = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query
  const orderAggregate = Order.aggregate([
    {
      $match:
        status && AvailableOrderStatuses.includes(status.toUpperCase())
          ? {
              status: status.toUpperCase(),
            }
          : {},
    },
    {
      $lookup: {
        from: "users",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        customer: { $first: "$customer" },
        coupon: { $ifNull: [{ $first: "$coupon" }, null] },
        totalOrderItems: { $size: "$items" },
      },
    },
    {
      $project: {
        items: 0,
      },
    },
  ])

  const orders = await EcomOrder.aggregatePaginate(
    orderAggregate,
    getMongoosePaginationOptions({
      page,
      limit,
      customLabels: {
        totalDocs: "totalOrders",
        docs: "orders",
      },
    })
  )

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"))
})

export {
  generateRazorpayOrder,
  verifyRazorpayPayment,
  getOrderById,
  getOrderListAdmin,
  updateOrderStatus,
}
