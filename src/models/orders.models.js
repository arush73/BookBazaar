import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
import {
  AvailableOrderStatuses,
  AvailablePaymentProviders,
  OrderStatusEnum,
  PaymentProviderEnum,
} from "../constants.js"

const orderSchema = new mongoose.Schema(
  {
    orderPrice: {
      type: Number,
      required: true,
    },
    discountedOrderPrice: {
      type: Number,
      required: true,
    },
    // coupon: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Coupon",
    //   default: null,
    // },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
          },
          quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity can not be less then 1."],
            default: 1,
          },
        },
      ],
      default: [],
    },
    address: {
      addressLine1: {
        required: true,
        type: String,
      },
      addressLine2: {
        type: String,
      },
      city: {
        required: true,
        type: String,
      },
      country: {
        required: true,
        type: String,
      },
      pincode: {
        required: true,
        type: String,
      },
      state: {
        required: true,
        type: String,
      },
    },
    status: {
      type: String,
      enum: AvailableOrderStatuses,
      default: OrderStatusEnum.PENDING,
    },
    paymentProvider: {
      type: String,
      enum: AvailablePaymentProviders,
      default: PaymentProviderEnum.UNKNOWN,
    },
    paymentId: {
      type: String,
    },
    // This field shows if the payment is done or not
    isPaymentDone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

orderSchema.plugin(mongooseAggregatePaginate)

const Order = mongoose.model("Order", orderSchema)

export default Order
