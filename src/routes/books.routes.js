import { Router } from "express"
import {  verifyJWT, verifyRole } from "../middlewares/auth.middleware.js"
import { UserRolesEnum } from "../constants.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()
router.use(verifyJWT)

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
  .get( getAllBooks)
  .post(
    
    verifyRole([UserRolesEnum.ADMIN]),
    upload.fields([
      { name: "mainImage", maxCount: 1 },
      { name: "subImages", maxCount: 4 },
    ]),
    addBook
  )
router
  .route("/books/:bookId")
  .get(getBookDetails)
  .patch(
    verifyRole([UserRolesEnum.ADMIN]),
    upload.fields([
      { name: "mainImage", maxCount: 1 },
      { name: "subImages", maxCount: 4 },
    ]),
    updateBook
  )
  .delete(verifyRole([UserRolesEnum.ADMIN]), deleteBook)

// reviewRoutes
// POST /books/:bookId/reviews → Add review to a book
// GET /books/:bookId/reviews → List reviews for a book
// DELETE / reviews /: id → Delete review(owner only)

router
  .route("/books/:BookId/reviews")
  .post( addReview)
  .get(getReviews)
router.route("/reviews/:id").delete( deleteReview)

export default router
