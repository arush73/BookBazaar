import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()
router.use(verifyJWT)

import {
  addItemOrUpdateItemQuantity,
  clearCart,
  getUserCart,
  removeItemFromCart,
} from "../controllers/cart.controllers.js"

router.route("/").get(getUserCart)

router.route("/clear").delete(clearCart)

router
  .route("/item/:bookId")
  .post(addItemOrUpdateItemQuantity)
  .delete(removeItemFromCart)

export default router
