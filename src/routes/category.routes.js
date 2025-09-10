import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()
router.use(verifyJWT)

import {} from "../controllers/category.controllers.js"

router.route("/").post(createCategory).get(getAllCategories)

router
  .route("/:categoryId")
  .get(getCategoryById)
  .delete(deleteCategory)
  .patch(updateCategory)

export default router
