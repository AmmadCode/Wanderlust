const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { redirectUrl } = require("../middleware.js");
const OTP = require("../models/otp");
const crypto = require("crypto");
const { sendOTPEmail } = require("../utils/emailService"); // your existing emailService

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Perform signup logic (e.g., create user in database)
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }

        // Redirect or respond after successful signup
        req.flash("success", "Successfully signed up!");
        res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  redirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    const { username } = req.body;
    req.flash("success", `Welcome back, ${username}!`);
    res.redirect(res.locals.redirectUrl || "/listings");
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
});

router.get("/forget-password", (req, res) => {
  res.render("users/forgotPassword");
});

router.post(
  "/forget-password",
  wrapAsync(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "No user found with that email address.");
      return res.redirect("/forget-password");
    }
    // 2. Generate secure 6-digit OTP (100000 - 999999)
    const otp = crypto.randomInt(100000, 1000000).toString();
    // 3. Remove any previous OTPs for this email
    await OTP.deleteMany({ email });
    // 4. Save new OTP (your schema TTL will auto-delete after 5 minutes)
    await OTP.create({ email, otp });
    // 5. Send OTP email (uses utils/emailService which uses your .env creds)
    try {
      await sendOTPEmail(email, otp);
      req.flash("success", "OTP sent to your email!");
      // redirect to verify page (safer than render to avoid reposts)
      return res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error("Error sending OTP email:", err);
      req.flash("error", "Error sending email. Please try again later.");
      return res.redirect("/forget-password");
    }
  })
);
// 1️⃣ Show verify OTP form
router.get("/verify-otp", (req, res) => {
  res.render("users/verifyotp", { email: req.query.email });
});

// 2️⃣ Handle OTP verification
// POST /verify-otp  (user submits OTP)
// POST /verify-otp  (user submits OTP)
// POST route to verify OTP
router.post("/verify-otp", wrapAsync(async (req, res) => {
  const { email, otp } = req.body;
  
  // Find OTP in database
  const otpRecord = await OTP.findOne({ email, otp });
  
  if (!otpRecord) {
  req.flash("error", "Invalid or expired OTP!");
  return res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
}

  
  // OTP is valid, delete it and proceed to reset password
  await OTP.deleteOne({ _id: otpRecord._id });
  
  // Store email in session for reset password page
  req.session.resetEmail = email;
  res.render("users/resetpassword", { email });
}));


// reset 
router.get("/reset-password", (req,res) => {
  if(!req.session.resetEmail) {
    req.flash("error", "Invalid or expires session ! please start over")
    return res.redirect("/forget-password");
  }
  res.render("users/resetpassword", { email: req.session.resetEmail });

});


router.post(
  "/reset-password",
  wrapAsync(async (req, res) => {
    const { password, confirmPassword } = req.body;

    // 1. Ensure session has email (user passed OTP check)
    if (!req.session.resetEmail) {
      req.flash("error", "Invalid or expired session. Please start over.");
      return res.redirect("/forget-password");
    }


    // ✅ ADD: Validate empty fields
    if (!password || !confirmPassword) {
      req.flash("error", "Both password fields are required!");
      return res.render("users/resetpassword", {
        email: req.session.resetEmail,
      });
    }

      // ✅ ADD: Validate password length  
    if (password.length < 6) {
      req.flash("error", "Password must be at least 6 characters long!");
      return res.render("users/resetpassword", {
        email: req.session.resetEmail,
      });
    }

    // 2. Check passwords match
    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match!");
      return res.render("users/resetpassword", {
        email: req.session.resetEmail,
      });
    }

    // 3. Find user
    const user = await User.findOne({ email: req.session.resetEmail });
    if (!user) {
      req.flash("error", "User not found!");
      delete req.session.resetEmail; // ✅ ADD: Clear session
      return res.redirect("/forget-password");

    }

    // 4. Update password (passport-local-mongoose helper)
    await user.setPassword(password);
    await user.save();

    // 5. Clear session
    delete req.session.resetEmail;

    // 6. Redirect to login
    req.flash("success", "Password reset successfully! Please log in.");
    res.redirect("/login");
  })
);


module.exports = router;
