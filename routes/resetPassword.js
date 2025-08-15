const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const resetPasswordController = require("../controllers/resetPassword.js");

router
  .route("/forget-password")
  .get(resetPasswordController.renderForgotPassword)
  .post(wrapAsync(resetPasswordController.resetPasswordOtp));

router
  .route("/verify-otp")
  .get(resetPasswordController.renderVerifyOtp)
  .post(wrapAsync(resetPasswordController.verifyOtp));

router
  .route("/reset-password")
  .get(resetPasswordController.renderResetPassword)
  .post(wrapAsync(resetPasswordController.resetPassword));

module.exports = router;
