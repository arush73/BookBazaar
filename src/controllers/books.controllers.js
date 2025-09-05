import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { addBookSchema } from "../validators/books.validators.js"
import Book from "../models/books.models.js"
import { deleteCloudinary, uploadCloudinary } from "../utils/cloudinary.js"
import Review from "../models/reviews.models.js"
import { getMongoosePaginationOptions } from "../utils/helpers.js"

// learn about this mongoose aggregate paginate thing !!!
const getAllBooks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query
  const bookAggregate = Book.aggregate([{ $match: {} }])

  const books = await Book.aggregatePaginate(
    productAggregate,
    getMongoosePaginationOptions({
      page,
      limit,
      customLabels: {
        totalDocs: "totalBooks",
        docs: "books",
      },
    })
  )

  return res
    .status(200)
    .json(new ApiResponse(200, "books fetched successfully", books))
})

// category thing to be done !!!
const addBook = asyncHandler(async (req, res) => {
  const validate = addBookSchema.safeParse(req.body)
  if (!validate.success)
    throw new ApiError(
      401,
      validate.error.issues.map((mess) => mess.message)
    )

  const { title, author, description, price, stock, category } = req.body

  const mainImagePath = req.files?.mainImage[0].path
  let subImagesPath = []
  req.files?.subImages.map((element) => {
    subImagesPath.push(element.path)
  })
  console.log("Main Image Path: ", mainImagePath)
  const uploadMainImage = await uploadCloudinary(mainImagePath)
  let subImagesURL = []
  for (const element of subImagesPath) {
    const temp = await uploadCloudinary(element)
    subImagesURL.push(temp.url)
  }

  // console.log("uplaodMainImage: ", uploadMainImage)
  // console.log("subImagesURL: ", subImagesURL)

  const book = await Book.create({
    title,
    author,
    description,
    price,
    stock,
    // category,
    mainImage: uploadMainImage.url,
    subImages: subImagesURL,
  })

  if (!book)
    throw new ApiError(
      500,
      "Something went wrong while adding the book in the db"
    )

  return res
    .status(201)
    .json(new ApiResponse(200, "book added successfully", book))
})

const getBookDetails = asyncHandler(async (req, res) => {
  const { bookId } = req.params
  if (!bookId) throw new ApiError(400, "bookId not found in the req params")

  const book = await Book.findById(bookId)
  if (!book) throw new ApiError(500, "failed to fetch the book")

  return res
    .status(200)
    .json(new ApiResponse(200, "book data fetched successfully!!", book))
})

const updateBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params

  const validate = addBookSchema.safeParse(req.body)
  if (!validate.success)
    throw new ApiError(
      401,
      validate.error.issues.map((mess) => mess.message)
    )

  const { title, author, description, price, stock, category } = req.body

  if (!bookId) throw new ApiError(401, "bookId not found in the params")

  const book = await Book.findById(bookId)

  let mainImageURL = null
  let subImagesURL = []
  if (req.files) {
    const mainImagePath = req.files?.mainImage[0].path
    const subImagesPath = []

    for (const element of req.files.subImages) {
      subImagesPath.push(element.path)
    }

    // deletion of old images from cloudinary
    await deleteCloudinary(book.mainImage)
    for (const element of book.subImages) {
      deleteCloudinary(element)
    }

    if (mainImagePath) {
      mainImageURL = await uploadCloudinary(mainImagePath)
    }

    for (const element of subImagesPath) {
      const temp = await uploadCloudinary(element)
      subImagesURL.push(temp.url)
    }
  }

  book.title = title
  book.author = author
  book.description = description
  book.price = price
  book.stock = stock
  book.mainImage = mainImageURL
  book.subImages = subImagesURL
  await book.save({ validateBeforeSave: false })

  const updatedBook = await Book.findById(bookId)

  return res
    .status(200)
    .json(new ApiResponse(200, "book updated successfully", updatedBook))
})

const deleteBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params

  if (!bookId) throw new ApiError(401, "bookId not found in the req params")

  const deleteBook = await Book.findByIdAndDelete(bookId)
  if (!deleteBook) throw new ApiError(500, "error deleting the book")

  // delete the mainImage and subImages from the cloudinary

  for (const element of deleteBook.subImages) {
    await deleteCloudinary(element)
  }

  await deleteCloudinary(deleteBook.mainImage)

  return res
    .status(200)
    .json(new ApiResponse(200, "book deleted successfully", {}))
})

const addReview = asyncHandler(async (req, res) => {
  const { bookId } = req.params

  const validate = addReviewSchema.safeParse(req.body)
  if (!validate.success)
    throw new ApiError(
      401,
      validate.error.issues.map((mess) => mess.message)
    )

  const { comment, rating } = req.body

  if (!bookId) throw new ApiError(401, "bookId not found in the params")

  const review = await Review.create({
    user: req.user._id,
    book: bookId,
    rating,
    comment,
  })

  if (!review) throw new ApiError(500, "failed to add review")

  return res
    .status(200)
    .json(new ApiResponse(200, "review added succseefully", review))
})

const getReviews = asyncHandler(async (req, res) => {
  const { bookId } = req.params

  if (!bookId) throw new ApiError(400, "bookId not found in the params")

  const reviews = await Review.find({
    bookId,
  })

  if (!reviews) throw new ApiError(500, "Failed to get the reviews")

  return res
    .status(200)
    .json(new ApiResponse(200, "reviews fetched successfully", reviews))
})

const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (!id) throw new ApiError(401, "id not found in the req params")

  const review = await Review.findById(id)

  if (review.user !== req.user._id)
    throw new ApiError(401, "you can only delete review submmited by you")

  const deleteReview = await Review.findByIdAndDelete(id)
  if (!deleteReview) throw new ApiError(500, "error deleting the review")

  return res
    .status(200)
    .json(new ApiResponse(200, "review deleted Successfully", {}))
})

export {
  getAllBooks,
  addBook,
  getBookDetails,
  updateBook,
  deleteBook,
  addReview,
  getReviews,
  deleteReview,
}
