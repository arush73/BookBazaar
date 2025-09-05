import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { addBookSchema } from "../validators/books.validators.js"
import Book from "../models/books.models.js"

const getAllBooks = asyncHandler(async (req, res) => {
  const validate = addBookSchema.safeParse(req.body)
  if (!validate.success)
    throw new ApiError(
      401,
      validate.error.issues.map((mess) => mess.message)
    )
  
  const {title, author, description} = req.body
  
  const book = await Book.create({
    title
  })
  
  return res. status(201).json(new ApiResponse(200,"book added successfully", book))
})

const addBook = asyncHandler(async (req, res) => {})

const getBookDetails = asyncHandler(async (req, res) => {})

const updateBook = asyncHandler(async (req, res) => {})

const deleteBook = asyncHandler(async (req, res) => {})

const addReview = asyncHandler(async (req, res) => {})

const getReviews = asyncHandler(async (req, res) => {})

export {
  getAllBooks,
  addBook,
  getBookDetails,
  updateBook,
  deleteBook,
  addReview,
  getReviews,
}
