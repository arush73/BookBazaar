import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import passport from "passport"

const router = Router()

import {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgottenPassword,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAvatar,
  handleSocialLogin
} from "../controllers/auth.controllers.js"

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/verify-email/:verificationToken").get(verifyEmail)
router.route("/forgot-password").post(forgotPasswordRequest)
router.route("/reset-password/:resetToken").post(resetForgottenPassword)

router.route("/logout").post(verifyJWT, logoutUser)
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (_, res) => {
    res.send("redirecting to google...")
  }
)

router
  .route("/google/callback")
  .get(passport.authenticate("google"), handleSocialLogin);

export default router
