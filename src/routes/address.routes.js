import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const router = Router()
router.use(verifyJWT)

import {
  createAddress,
  deleteAddress,
  getAddressById,
  getAllAddresses,
  updateAddress,
} from "../controllers/address.controllers.js"

router.route("/").post(createAddress).get(getAllAddresses)

router
  .route("/:addressId")
  .get(getAddressById)
  .delete(deleteAddress)
  .patch(updateAddress)

export default router
