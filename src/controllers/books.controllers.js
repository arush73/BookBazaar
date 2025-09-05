import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { addBookSchema } from "../validators/books.validators.js"
import Book from "../models/books.models.js"
import { uploadCloudinary } from "../utils/cloudinary.js"

const getAllBooks = asyncHandler(async (req, res) => {})

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

  console.log("uplaodMainImage: ", uploadMainImage)
  console.log("subImagesURL: ", subImagesURL)

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

const getBookDetails = asyncHandler(async (req, res) => {})

const updateBook = asyncHandler(async (req, res) => {})

const deleteBook = asyncHandler(async (req, res) => {})

const addReview = asyncHandler(async (req, res) => {})

const getReviews = asyncHandler(async (req, res) => {})

const deleteReview = asyncHandler(async (req, res) => {})

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
