import { Router } from "express"
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js"
import { UserRolesEnum } from "../constants.js"
import { upload } from "../middlewares/multer.middleware.js"
const router = Router()

// POST /books → Add a book (Admin only)
// GET /books → List all books (public, supports filters)
// GET /books/:id → Get book details
// PUT /books/:id → Update book (Admin only)
// DELETE /books/:id → Delete book (Admin only)

import {
  getAllBooks,
  addBook,
  getBookDetails,
  updateBook,
  deleteBook,
  addReview,
  getReviews,
  deleteReview,
} from "../controllers/books.controllers.js"

router
  .route("/books")
  .get(verifyJWT, getAllBooks)
  .post(
    verifyJWT,
    verifyRole([UserRolesEnum.ADMIN]),
    upload.fields([
      { name: "mainImage", maxCount: 1 },
      { name: "subImages", maxCount: 4 },
    ]),
    addBook
  )
router
  .route("/books/:id")
  .get(verifyJWT, getBookDetails)
  .put(verifyJWT, verifyRole([UserRolesEnum.ADMIN]), updateBook)
  .delete(verifyJWT, verifyRole([UserRolesEnum.ADMIN]), deleteBook)

// reviewRoutes
// POST /books/:bookId/reviews → Add review to a book
// GET /books/:bookId/reviews → List reviews for a book
// DELETE / reviews /: id → Delete review(owner only)

router
  .route("/books/:BookId/reviews")
  .post(verifyJWT, addReview)
  .get(getReviews)
router.route("/reviews/:id").delete(verifyJWT, deleteReview)

export default router
