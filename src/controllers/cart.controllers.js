import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import Cart from "../models/cart.models.js"
import Book from "../models/books.models.js"

export const getCart = async (userId) => {
  const cartAggregation = await Cart.aggregate([
    {
      $match: {
        owner: userId,
      },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "books",
        localField: "items.bookId",
        foreignField: "_id",
        as: "book",
      },
    },
    {
      $project: {
        book: { $first: "$book" },
        quantity: "$items.quantity",
      },
    },
    {
      $group: {
        _id: "$_id",
        items: {
          $push: "$$ROOT",
        },
        cartTotal: {
          $sum: {
            $multiply: ["$book.price", "$quantity"],
          },
        },
      },
    },
    {
      $addFields: {
        discountedTotal: "$cartTotal",
      },
    },
  ])

  return (
    cartAggregation[0] ?? {
      _id: null,
      items: [],
      cartTotal: 0,
      discountedTotal: 0,
    }
  )
}

const getUserCart = asyncHandler(async (req, res) => {
  let cart = await getCart(req.user._id)

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart fetched successfully"))
})

const addItemOrUpdateItemQuantity = asyncHandler(async (req, res) => {
  const { bookId } = req.params
  const { quantity = 1 } = req.body

  const cart = await Cart.findOne({
    owner: req.user._id,
  })

  const book = await Book.findById(bookId)

  if (!book) {
    throw new ApiError(404, "Product does not exist")
  }

  if (quantity > book.stock) {
    throw new ApiError(
      400,
      book.stock > 0
        ? "Only " +
          book.stock +
          " products are remaining. But you are adding " +
          quantity
        : "Product is out of stock"
    )
  }

  const addedBook = cart.items?.find(
    (item) => item.bookId.toString() === bookId
  )

  if (addedBook) {
    addedBook.quantity = quantity
  } else {
    cart.items.push({
      bookId,
      quantity,
    })
  }

  await cart.save({ validateBeforeSave: true })

  const newCart = await getCart(req.user._id)

  return res
    .status(200)
    .json(new ApiResponse(200, "Item added successfully", newCart))
})

const removeItemFromCart = asyncHandler(async (req, res) => {
  const { bookId } = req.params

  const book = await Book.findById(bookId)

  // check for book existence
  if (!book) {
    throw new ApiError(404, "Product does not exist")
  }

  const updatedCart = await Cart.findOneAndUpdate(
    {
      owner: req.user._id,
    },
    {
      $pull: {
        items: {
          bookId: bookId,
        },
      },
    },
    { new: true }
  )

  let cart = await getCart(req.user._id)

  return res
    .status(200)
    .json(new ApiResponse(200,  "Cart item removed successfully", cart))
})

const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate(
    {
      owner: req.user._id,
    },
    {
      $set: {
        items: [],
        coupon: null,
      },
    },
    { new: true }
  )
  const cart = await getCart(req.user._id)

  return res
    .status(200)
    .json(new ApiResponse(200, "Cart has been cleared", cart))
})

export {
  getUserCart,
  addItemOrUpdateItemQuantity,
  removeItemFromCart,
  clearCart,
}
