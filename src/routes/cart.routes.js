import { Router } from "express"
import { verifyJWT } from "../../../middlewares/auth.middlewares.js"

const router = Router()
router.use(verifyJWT)

import {
  addItemOrUpdateItemQuantity,
  clearCart,
  getUserCart,
  removeItemFromCart,
} from "../../../controllers/apps/ecommerce/cart.controllers.js"

router.route("/").get(getUserCart)

router.route("/clear").delete(clearCart)

router
  .route("/item/:productId")
  .post(addItemOrUpdateItemQuantity)
  .delete(removeItemFromCart)

export default router
