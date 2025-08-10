# 🔐 Authentication & Authorization Guide for WanderLust

## Table of Contents
1. [Overview](#overview)
2. [Authentication vs Authorization](#authentication-vs-authorization)
3. [Technology Stack](#technology-stack)
4. [Session Management](#session-management)
5. [Passport.js Implementation](#passportjs-implementation)
6. [Flash Messages](#flash-messages)
7. [Middleware Architecture](#middleware-architecture)
8. [User Flow Diagrams](#user-flow-diagrams)
9. [Code Implementation Details](#code-implementation-details)
10. [Email Service & Password Reset](#email-service--password-reset)
11. [Enhanced Security Best Practices](#enhanced-security-best-practices)
12. [Complete Security Checklist](#complete-security-checklist)

---

## 📋 Overview

WanderLust uses a robust authentication and authorization system to protect user data and control access to various features. This guide explains how everything works together.

### Key Components:
- **Express Sessions** - Stores user data across requests
- **Passport.js** - Handles authentication strategies
- **Connect-Flash** - Displays success/error messages
- **Custom Middleware** - Controls access to protected routes
- **Nodemailer** - Email service for password reset
- **OTP System** - Secure one-time passwords with TTL

---

## 🔑 Authentication vs Authorization

### Authentication (Who are you?)
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│   Login     │────▶│  Verified   │
│ Credentials │     │   Process   │     │   Identity  │
└─────────────┘     └─────────────┘     └─────────────┘
```
**Authentication** verifies the identity of a user. In WanderLust:
- Users provide username and password
- System verifies these credentials
- If valid, user is "authenticated"

### Authorization (What can you do?)
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│Authenticated│────▶│  Check      │────▶│  Access     │
│    User     │     │Permissions  │     │Granted/Denied│
└─────────────┘     └─────────────┘     └─────────────┘
```
**Authorization** determines what an authenticated user can access. In WanderLust:
- Can they edit a listing? (Only if they own it)
- Can they delete a review? (Only if they wrote it)
- Can they create a new listing? (Only if logged in)

---

## 🛠️ Technology Stack

### 1. Express-Session
Manages user sessions on the server side.

```javascript
// In app.js
const session = require("express-session");

const sessionOptions = {
  secret: "MySecretKey",              // Used to sign the session ID cookie
  resave: false,                      // Don't save session if unmodified
  saveUninitialized: true,            // Save uninitialized sessions
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,                   // Prevents client-side JS from reading the cookie
  }
};

app.use(session(sessionOptions));
```

### 2. Passport.js
Authentication middleware for Node.js.

```javascript
// In app.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

app.use(passport.initialize());      // Initialize Passport
app.use(passport.session());          // Use Passport with sessions
passport.use(new LocalStrategy(User.authenticate())); // Use local strategy

passport.serializeUser(User.serializeUser());     // How to store user in session
passport.deserializeUser(User.deserializeUser()); // How to retrieve user from session
```

### 3. Connect-Flash
For displaying temporary messages.

```javascript
// In app.js
const flash = require("connect-flash");
app.use(flash());

// Make flash messages available in all templates
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
```

---

## 📦 Session Management

### How Sessions Work:

```
┌──────────────────────────────────────────────────────────────┐
│                        First Visit                            │
├──────────────────────────────────────────────────────────────┤
│  Browser                    Server                            │
│     │                         │                               │
│     ├──── Request ──────────▶ │                               │
│     │                         ├─ Create Session               │
│     │                         ├─ Generate Session ID          │
│     │                         ├─ Store in Memory/Database     │
│     │◀─── Response + Cookie ─┤                               │
│     │    (session-id=abc123) │                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                     Subsequent Visits                         │
├──────────────────────────────────────────────────────────────┤
│  Browser                    Server                            │
│     │                         │                               │
│     ├─ Request + Cookie ─────▶│                               │
│     │  (session-id=abc123)   ├─ Find Session by ID           │
│     │                         ├─ Load Session Data            │
│     │                         ├─ Process Request              │
│     │◀──── Response ─────────┤                               │
└──────────────────────────────────────────────────────────────┘
```

### Session Data Structure:
```javascript
req.session = {
  cookie: { /* cookie settings */ },
  passport: { user: 'userId' },      // After login
  redirectUrl: '/listings/123',      // For redirect after login
  flash: { 
    success: ['Welcome back!'],
    error: ['You must be logged in']
  }
}
```

---

## 🎯 Passport.js Implementation

### Authentication Flow:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Login     │────▶│  Passport   │────▶│   User      │────▶│  Session    │
│   Form      │     │Authenticate │     │  Database   │     │   Store     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      │                    │                    │                    │
      │                    ▼                    ▼                    ▼
   username           Verify with          Find user &         Serialize user
   password           LocalStrategy        check password      Store user ID
```

### Login Route Implementation:
```javascript
// routes/user.js
router.post("/login", 
  redirectUrl,  // Middleware to handle redirect after login
  passport.authenticate("local", { 
    failureFlash: true, 
    failureRedirect: "/login" 
  }), 
  async (req, res) => {
    const { username } = req.body;
    req.flash("success", `Welcome back, ${username}!`);
    res.redirect(res.locals.redirectUrl || "/listings");
  }
);
```

### User Model with Passport:
```javascript
// models/user.js
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  }
  // username and password fields are added by passport-local-mongoose
});

userSchema.plugin(passportLocalMongoose);
```

---

## 💬 Flash Messages

### How Flash Messages Work:

```
┌────────────────────────────────────────────────────────┐
│                   Request Lifecycle                     │
├────────────────────────────────────────────────────────┤
│                                                         │
│  1. Action Occurs                                       │
│     └─▶ req.flash("success", "Listing created!")       │
│                                                         │
│  2. Redirect Happens                                    │
│     └─▶ res.redirect("/listings")                      │
│                                                         │
│  3. Next Request                                        │
│     └─▶ res.locals.success = req.flash("success")      │
│         (Message is retrieved and cleared)              │
│                                                         │
│  4. Template Renders                                    │
│     └─▶ <%= success %> displays the message            │
│                                                         │
└────────────────────────────────────────────────────────┘
```

### Flash Message Implementation:
```javascript
// Setting a flash message
req.flash("error", "You must be logged in!");

// In app.js - Making flash available to all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// In views/includes/flash.ejs
<% if(success && success.length) { %>
  <div class="alert alert-success">
    <%= success %>
  </div>
<% } %>
```

---

## 🛡️ Middleware Architecture

### Middleware Chain:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Request   │────▶│ isLoggedIn  │────▶│  isOwner/   │────▶│   Route     │
│             │     │ Middleware  │     │isReviewAuthor│     │  Handler    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │                     │
                           ▼                     ▼
                    Check if user is      Check if user has
                    authenticated         permission for resource
```

### 1. isLoggedIn Middleware:
```javascript
// middleware.js
module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    // Save the URL they were trying to access
    req.session.redirectUrl = req.path.includes('/reviews/') 
      ? `/listings/${req.params.id}` 
      : req.originalUrl;
    req.flash("error", "You must be logged in to do that!");
    return res.redirect("/login");
  }
  next();
};
```

### 2. isOwner Middleware:
```javascript
// middleware.js
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
```

### 3. isReviewAuthor Middleware:
```javascript
// middleware.js
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }
  if(!review.author._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
```

---

## 🔄 User Flow Diagrams

### 1. Login Flow with Redirect:

```
┌─────────────────────────────────────────────────────────────────┐
│                    User tries to delete a review                 │
│                        (not logged in)                           │
└───────────────────────┬─────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                 isLoggedIn middleware triggers                   │
│            • Saves URL to session.redirectUrl                    │
│            • Redirects to /login                                 │
└───────────────────────┬─────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    User enters credentials                       │
│                    and submits login form                        │
└───────────────────────┬─────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Passport authenticates user                      │
│            • redirectUrl middleware runs                         │
│            • Copies session.redirectUrl to res.locals           │
└───────────────────────┬─────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Login route handler runs                        │
│            • Shows success message                               │
│            • Redirects to saved URL or /listings                │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Authorization Flow for Deleting Review:

```
┌─────────────────────────────────────────────────────────────────┐
│                  User clicks delete review button                │
│                        (is logged in)                            │
└───────────────────────┬─────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    isLoggedIn middleware                         │
│                  • Checks req.isAuthenticated()                  │
│                  • User is logged in ✓                           │
└───────────────────────┬─────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                 isReviewAuthor middleware                        │
│            • Finds review by ID                                  │
│            • Checks if user is author                            │
└───────────────────────┬─────────────────────────────────────────┘
                        │
           ┌────────────┴────────────┐
           ▼                         ▼
┌─────────────────────┐    ┌─────────────────────┐
│   User is author    │    │ User is NOT author  │
│   • Delete review   │    │ • Show error message│
│   • Show success    │    │ • Redirect back     │
└─────────────────────┘    └─────────────────────┘
```

---

## 📝 Code Implementation Details

### 1. Complete Authentication Setup (app.js):

```javascript
// 1. Import required packages
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

// 2. Configure session (MUST come before passport)
const sessionOptions = {
  secret: "MySecretKey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

app.use(session(sessionOptions));
app.use(flash());

// 3. Configure Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 4. Set up locals middleware (MUST come after passport)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});
```

### 2. Protected Routes Implementation:

```javascript
// routes/listing.js - Example of protected routes

// Only logged-in users can access the new listing form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// Only logged-in users can create listings
router.post("/", 
  validateListing,
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Associate with logged-in user
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

// Only owners can edit their listings
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// Only owners can delete their listings
router.delete("/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);
```

### 3. User Routes with Authentication:

```javascript
// routes/user.js

// Signup route
router.post("/signup", wrapAsync(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    
    // Automatically log in after signup
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Successfully signed up!");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
}));

// Login route with redirect functionality
router.post("/login", 
  redirectUrl,
  passport.authenticate("local", { 
    failureFlash: true, 
    failureRedirect: "/login" 
  }), 
  async (req, res) => {
    const { username } = req.body;
    req.flash("success", `Welcome back, ${username}!`);
    res.redirect(res.locals.redirectUrl || "/listings");
  }
);

// Logout route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
});
```

### 4. View Templates with Authentication:

```ejs
<!-- views/includes/navbar.ejs -->
<nav class="navbar">
  <div class="navbar-nav">
    <a href="/">Home</a>
    <a href="/listings">All Listings</a>
    <a href="/listings/new">Add new listing</a>
  </div>
  
  <div class="navbar-nav ms-auto">
    <% if(!currentUser) { %>
      <a href="/signup">Sign Up</a>
      <a href="/login">Log In</a>
    <% } else { %>
      <span>Welcome, <%= currentUser.username %>!</span>
      <a href="/logout">Log Out</a>
    <% } %>
  </div>
</nav>

<!-- views/listings/show.ejs - Conditional rendering -->
<% if(currentUser && listing.owner._id.equals(currentUser._id)) { %>
  <a href="/listings/<%= listing._id %>/edit">Edit</a>
  <form action="/listings/<%= listing._id %>?_method=DELETE" method="POST">
    <button>Delete</button>
  </form>
<% } %>

<!-- Review delete button - only visible when logged in -->
<% if(currentUser) { %>
  <form action="/listings/<%= listing._id %>/reviews/<%= review._id %>?_method=DELETE" method="POST">
    <button>Delete Review</button>
  </form>
<% } %>
```

---

## 📧 Email Service & Password Reset

### Overview
WanderLust implements a secure password reset system using email verification with OTP (One-Time Password). This ensures users can recover their accounts safely.

### Email Service Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│   Request   │────▶│  Generate   │────▶│   Send      │
│   Forgets   │     │   Reset     │     │    OTP      │     │   Email     │
│  Password   │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │                    │                    │
                           ▼                    ▼                    ▼
                    Check if user        6-digit random       Nodemailer
                    exists in DB         number (TTL: 5min)   via Gmail
```

### 1. Email Configuration (utils/emailService.js)

```javascript
const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App-specific password
  },
});

// Send OTP Email Function
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"WanderLust Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP - WanderLust",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You requested to reset your password. Use the OTP below:</p>
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #4CAF50; font-size: 36px; letter-spacing: 5px; margin: 0;">${otp}</h1>
        </div>
        <p><strong>This OTP will expire in 5 minutes.</strong></p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated email from WanderLust. Please do not reply.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
```

### 2. OTP Model (models/otp.js)

```javascript
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Auto-delete after 5 minutes (300 seconds)
  },
});

module.exports = mongoose.model("OTP", otpSchema);
```

### 3. Password Reset Flow

#### Step 1: Request Password Reset
```javascript
router.post("/forget-password", wrapAsync(async (req, res) => {
  const { email } = req.body;
  
  // 1. Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    req.flash("error", "No user found with that email address.");
    return res.redirect("/forget-password");
  }
  
  // 2. Generate secure 6-digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString();
  
  // 3. Remove any previous OTPs for this email
  await OTP.deleteMany({ email });
  
  // 4. Save new OTP (auto-expires after 5 minutes)
  await OTP.create({ email, otp });
  
  // 5. Send OTP email
  try {
    await sendOTPEmail(email, otp);
    req.flash("success", "OTP sent to your email!");
    return res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
  } catch (err) {
    console.error("Error sending OTP email:", err);
    req.flash("error", "Error sending email. Please try again later.");
    return res.redirect("/forget-password");
  }
}));
```

#### Step 2: Verify OTP
```javascript
router.post("/verify-otp", wrapAsync(async (req, res) => {
  const { email, otp } = req.body;
  
  // Find OTP in database
  const otpRecord = await OTP.findOne({ email, otp });
  
  if (!otpRecord) {
    req.flash("error", "Invalid or expired OTP!");
    return res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
  }
  
  // OTP is valid, delete it
  await OTP.deleteOne({ _id: otpRecord._id });
  
  // Store email in session for reset password page
  req.session.resetEmail = email;
  res.render("users/resetpassword", { email });
}));
```

#### Step 3: Reset Password
```javascript
router.post("/reset-password", wrapAsync(async (req, res) => {
  const { password, confirmPassword } = req.body;
  
  // 1. Ensure session has email (user passed OTP check)
  if (!req.session.resetEmail) {
    req.flash("error", "Invalid or expired session. Please start over.");
    return res.redirect("/forget-password");
  }
  
  // 2. Validate password fields
  if (!password || !confirmPassword) {
    req.flash("error", "Both password fields are required!");
    return res.render("users/resetpassword", {
      email: req.session.resetEmail,
    });
  }
  
  // 3. Validate password length
  if (password.length < 6) {
    req.flash("error", "Password must be at least 6 characters long!");
    return res.render("users/resetpassword", {
      email: req.session.resetEmail,
    });
  }
  
  // 4. Check passwords match
  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match!");
    return res.render("users/resetpassword", {
      email: req.session.resetEmail,
    });
  }
  
  // 5. Find user and update password
  const user = await User.findOne({ email: req.session.resetEmail });
  if (!user) {
    req.flash("error", "User not found!");
    delete req.session.resetEmail;
    return res.redirect("/forget-password");
  }
  
  // 6. Update password using passport-local-mongoose
  await user.setPassword(password);
  await user.save();
  
  // 7. Clear session and redirect
  delete req.session.resetEmail;
  req.flash("success", "Password reset successfully! Please log in.");
  res.redirect("/login");
}));
```

### 4. Email Security Best Practices

#### Gmail App Password Setup
1. Enable 2-factor authentication on Gmail account
2. Generate app-specific password
3. Store in environment variables:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
```

#### Security Considerations
- **OTP Expiration**: 5-minute TTL prevents replay attacks
- **Single Use**: OTP deleted immediately after verification
- **Session-based Flow**: Email stored in session, not in URL
- **Rate Limiting**: Implement to prevent abuse
- **Secure Random**: Using crypto.randomInt for cryptographically secure OTPs

### 5. Password Reset Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Complete Password Reset Flow                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User clicks "Forgot Password"                                │
│     └─▶ GET /forget-password                                     │
│                                                                   │
│  2. User enters email                                             │
│     └─▶ POST /forget-password                                    │
│         ├─ Validate user exists                                  │
│         ├─ Generate 6-digit OTP                                  │
│         ├─ Save OTP with 5min TTL                               │
│         └─ Send email with OTP                                   │
│                                                                   │
│  3. User receives email & enters OTP                             │
│     └─▶ POST /verify-otp                                         │
│         ├─ Validate OTP exists & not expired                     │
│         ├─ Delete OTP (single use)                              │
│         └─ Store email in session                                │
│                                                                   │
│  4. User enters new password                                      │
│     └─▶ POST /reset-password                                     │
│         ├─ Validate session exists                               │
│         ├─ Validate password requirements                        │
│         ├─ Update user password                                  │
│         └─ Clear session & redirect to login                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Enhanced Security Best Practices

### 1. Environment Variables (.env)
```env
# MongoDB
MONGODB_USERNAME=your_username
MONGODB_PASSWORD=your_password
MONGODB_CLUSTER=your_cluster
MONGODB_DATABASE=your_database

# Session
SESSION_SECRET=your-super-secret-session-key

# Email Service
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Application
NODE_ENV=production
PORT=8080
```

### 2. Session Security Configuration
```javascript
const MongoStore = require('connect-mongo');

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: connectionString,
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'strict' // CSRF protection
  }
};
```

### 3. Password Security Enhancements
```javascript
// Password complexity requirements
const passwordSchema = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .messages({
    'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character'
  });

// Account lockout after failed attempts
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 2 * 60 * 60 * 1000; // 2 hours

userSchema.pre('save', async function(next) {
  if (this.loginAttempts >= MAX_LOGIN_ATTEMPTS && Date.now() - this.lastFailedLogin < LOCKOUT_TIME) {
    throw new Error('Account is locked due to too many failed login attempts');
  }
  next();
});
```

### 4. Rate Limiting Implementation
```javascript
const rateLimit = require('express-rate-limit');

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Password reset rate limiter
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: 'Too many password reset requests, please try again later',
});

// Apply to routes
router.post('/login', loginLimiter, passport.authenticate(...));
router.post('/forget-password', passwordResetLimiter, wrapAsync(...));
```

### 5. CSRF Protection
```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// Apply to all state-changing routes
router.use(csrfProtection);

// Make token available to views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// In forms
// <input type="hidden" name="_csrf" value="<%= csrfToken %>">
```

### 6. Security Headers
```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 7. Input Sanitization
```javascript
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Prevent NoSQL injection attacks
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Custom sanitization for specific fields
const sanitizeInput = (input) => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '');
};
```

### 8. Logging and Monitoring
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Log authentication events
const logAuthEvent = (event, user, ip) => {
  logger.info({
    event,
    user: user.username || user.email,
    ip,
    timestamp: new Date().toISOString()
  });
};

// Usage
router.post('/login', (req, res) => {
  logAuthEvent('login_attempt', req.body, req.ip);
  // ... rest of login logic
});
```

### 9. Secure Cookie Configuration
```javascript
app.use(session({
  // ... other options
  cookie: {
    secure: true, // HTTPS only
    httpOnly: true, // No JS access
    sameSite: 'strict', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/'
  }
}));
```

### 10. API Security
```javascript
// API Key Authentication for external services
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// CORS Configuration
const cors = require('cors');
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
}));
```

---

## 🚀 Complete Security Checklist

### Authentication & Sessions
✅ **Use HTTPS in production** - Encrypt all data in transit
✅ **Secure session configuration** - httpOnly, secure, sameSite cookies
✅ **Strong session secrets** - Long, random strings stored in env vars
✅ **Session store** - Use MongoDB/Redis for production
✅ **Session expiration** - Implement idle and absolute timeouts

### Password Management
✅ **Strong password policy** - Minimum length, complexity requirements
✅ **Secure password storage** - bcrypt/PBKDF2 with salt
✅ **Password reset security** - Time-limited OTPs, single use
✅ **Account lockout** - Prevent brute force attacks
✅ **Password history** - Prevent reuse of recent passwords

### Input Validation & Sanitization
✅ **Server-side validation** - Never trust client input
✅ **Schema validation** - Use Joi for structured validation
✅ **SQL/NoSQL injection prevention** - Parameterized queries, sanitization
✅ **XSS prevention** - Escape output, sanitize input
✅ **File upload validation** - Type, size, content verification

### Access Control
✅ **Authorization middleware** - Check permissions consistently
✅ **Principle of least privilege** - Users only access what they need
✅ **Resource ownership verification** - Users can only modify their own data
✅ **Admin panel protection** - Separate authentication, 2FA

### Security Headers & CSRF
✅ **Helmet.js** - Set security headers automatically
✅ **CSRF tokens** - Protect state-changing operations
✅ **CORS configuration** - Restrict cross-origin requests
✅ **Content Security Policy** - Prevent XSS and injection attacks

### Rate Limiting & DoS Protection
✅ **Login rate limiting** - Prevent brute force attacks
✅ **API rate limiting** - Prevent abuse and DoS
✅ **Request size limits** - Prevent large payload attacks
✅ **Timeout configuration** - Prevent slowloris attacks

### Logging & Monitoring
✅ **Authentication event logging** - Track login/logout/failures
✅ **Error logging** - Capture and analyze errors
✅ **Security event monitoring** - Detect suspicious patterns
✅ **Regular log review** - Identify potential security issues

### Email Security
✅ **App-specific passwords** - Don't use main account password
✅ **TLS/SSL for email** - Encrypt email transmission
✅ **Rate limit email sending** - Prevent spam abuse
✅ **Email validation** - Verify email format and existence

### Development & Deployment
✅ **Environment variables** - Never commit secrets
✅ **Dependency updates** - Regular security patches
✅ **Security testing** - Penetration testing, vulnerability scanning
✅ **Secure deployment** - Use CI/CD with security checks
✅ **Regular backups** - Encrypted, tested restore procedures

### Compliance & Privacy
✅ **GDPR compliance** - User data rights, consent
✅ **Privacy policy** - Clear data usage disclosure
✅ **Data encryption** - At rest and in transit
✅ **Secure data deletion** - Proper data lifecycle management

---

## 📧 Email Service & Password Reset

### Overview
WanderLust implements a secure password reset system using email verification with OTP (One-Time Password). This ensures users can recover their accounts safely.

### Email Service Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│   Request   │────▶│  Generate   │────▶│   Send      │
│   Forgets   │     │   Reset     │     │    OTP      │     │   Email     │
│  Password   │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │                    │                    │
                           ▼                    ▼                    ▼
                    Check if user        6-digit random       Nodemailer
                    exists in DB         number (TTL: 5min)   via Gmail
```

### 1. Email Configuration (utils/emailService.js)

```javascript
const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App-specific password
  },
});

// Send OTP Email Function
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"WanderLust Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP - WanderLust",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You requested to reset your password. Use the OTP below:</p>
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #4CAF50; font-size: 36px; letter-spacing: 5px; margin: 0;">${otp}</h1>
        </div>
        <p><strong>This OTP will expire in 5 minutes.</strong></p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated email from WanderLust. Please do not reply.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
```

### 2. OTP Model (models/otp.js)

```javascript
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Auto-delete after 5 minutes (300 seconds)
  },
});

module.exports = mongoose.model("OTP", otpSchema);
```

### 3. Password Reset Flow

#### Step 1: Request Password Reset
```javascript
router.post("/forget-password", wrapAsync(async (req, res) => {
  const { email } = req.body;
  
  // 1. Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    req.flash("error", "No user found with that email address.");
    return res.redirect("/forget-password");
  }
  
  // 2. Generate secure 6-digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString();
  
  // 3. Remove any previous OTPs for this email
  await OTP.deleteMany({ email });
  
  // 4. Save new OTP (auto-expires after 5 minutes)
  await OTP.create({ email, otp });
  
  // 5. Send OTP email
  try {
    await sendOTPEmail(email, otp);
    req.flash("success", "OTP sent to your email!");
    return res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
  } catch (err) {
    console.error("Error sending OTP email:", err);
    req.flash("error", "Error sending email. Please try again later.");
    return res.redirect("/forget-password");
  }
}));
```

#### Step 2: Verify OTP
```javascript
router.post("/verify-otp", wrapAsync(async (req, res) => {
  const { email, otp } = req.body;
  
  // Find OTP in database
  const otpRecord = await OTP.findOne({ email, otp });
  
  if (!otpRecord) {
    req.flash("error", "Invalid or expired OTP!");
    return res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
  }
  
  // OTP is valid, delete it
  await OTP.deleteOne({ _id: otpRecord._id });
  
  // Store email in session for reset password page
  req.session.resetEmail = email;
  res.render("users/resetpassword", { email });
}));
```

#### Step 3: Reset Password
```javascript
router.post("/reset-password", wrapAsync(async (req, res) => {
  const { password, confirmPassword } = req.body;
  
  // 1. Ensure session has email (user passed OTP check)
  if (!req.session.resetEmail) {
    req.flash("error", "Invalid or expired session. Please start over.");
    return res.redirect("/forget-password");
  }
  
  // 2. Validate password fields
  if (!password || !confirmPassword) {
    req.flash("error", "Both password fields are required!");
    return res.render("users/resetpassword", {
      email: req.session.resetEmail,
    });
  }
  
  // 3. Validate password length
  if (password.length < 6) {
    req.flash("error", "Password must be at least 6 characters long!");
    return res.render("users/resetpassword", {
      email: req.session.resetEmail,
    });
  }
  
  // 4. Check passwords match
  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match!");
    return res.render("users/resetpassword", {
      email: req.session.resetEmail,
    });
  }
  
  // 5. Find user and update password
  const user = await User.findOne({ email: req.session.resetEmail });
  if (!user) {
    req.flash("error", "User not found!");
    delete req.session.resetEmail;
    return res.redirect("/forget-password");
  }
  
  // 6. Update password using passport-local-mongoose
  await user.setPassword(password);
  await user.save();
  
  // 7. Clear session and redirect
  delete req.session.resetEmail;
  req.flash("success", "Password reset successfully! Please log in.");
  res.redirect("/login");
}));
```

### 4. Email Security Best Practices

#### Gmail App Password Setup
1. Enable 2-factor authentication on Gmail account
2. Generate app-specific password
3. Store in environment variables:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
```

#### Security Considerations
- **OTP Expiration**: 5-minute TTL prevents replay attacks
- **Single Use**: OTP deleted immediately after verification
- **Session-based Flow**: Email stored in session, not in URL
- **Rate Limiting**: Implement to prevent abuse
- **Secure Random**: Using crypto.randomInt for cryptographically secure OTPs

### 5. Password Reset Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Complete Password Reset Flow                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User clicks "Forgot Password"                                │
│     └─▶ GET /forget-password                                     │
│                                                                   │
│  2. User enters email                                             │
│     └─▶ POST /forget-password                                    │
│         ├─ Validate user exists                                  │
│         ├─ Generate 6-digit OTP                                  │
│         ├─ Save OTP with 5min TTL                               │
│         └─ Send email with OTP                                   │
│                                                                   │
│  3. User receives email & enters OTP                             │
│     └─▶ POST /verify-otp                                         │
│         ├─ Validate OTP exists & not expired                     │
│         ├─ Delete OTP (single use)                              │
│         └─ Store email in session                                │
│                                                                   │
│  4. User enters new password                                      │
│     └─▶ POST /reset-password                                     │
│         ├─ Validate session exists                               │
│         ├─ Validate password requirements                        │
│         ├─ Update user password                                  │
│         └─ Clear session & redirect to login                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Concepts Summary

### res.locals
`res.locals` is an object that contains response local variables scoped to the request. It's available to the view(s) rendered during that request/response cycle.

```javascript
// Setting values in res.locals
res.locals.currentUser = req.user;
res.locals.success = req.flash("success");

// These are now available in ALL templates as:
// <%= currentUser %>
// <%= success %>
```

### Why We Use res.locals:
1. **Template Access**: Makes data available to all templates without passing explicitly
2. **Request Scope**: Data exists only for current request
3. **Clean Code**: Avoids repetitive data passing
4. **Middleware Friendly**: Can be set in middleware and used in routes

### Session vs res.locals:
- **Session**: Persists across multiple requests (stored on server)
- **res.locals**: Exists only for current request (stored in memory)

```javascript
// Session data persists
req.session.userId = "123";  // Available in future requests

// res.locals is temporary
res.locals.message = "Hello"; // Only available in current request
```

---

## 🔒 Enhanced Security Best Practices

### 1. Environment Variables (.env)
```env
# MongoDB
MONGODB_USERNAME=your_username
MONGODB_PASSWORD=your_password
MONGODB_CLUSTER=your_cluster
MONGODB_DATABASE=your_database

# Session
SESSION_SECRET=your-super-secret-session-key

# Email Service
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Application
NODE_ENV=production
PORT=8080
```

### 2. Session Security Configuration
```javascript
const MongoStore = require('connect-mongo');

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: connectionString,
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'strict' // CSRF protection
  }
};
```

### 3. Password Security Enhancements
```javascript
// Password complexity requirements
const passwordSchema = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .messages({
    'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character'
  });

// Account lockout after failed attempts
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 2 * 60 * 60 * 1000; // 2 hours

userSchema.pre('save', async function(next) {
  if (this.loginAttempts >= MAX_LOGIN_ATTEMPTS && Date.now() - this.lastFailedLogin < LOCKOUT_TIME) {
    throw new Error('Account is locked due to too many failed login attempts');
  }
  next();
});
```

### 4. Rate Limiting Implementation
```javascript
const rateLimit = require('express-rate-limit');

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Password reset rate limiter
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: 'Too many password reset requests, please try again later',
});

// Apply to routes
router.post('/login', loginLimiter, passport.authenticate(...));
router.post('/forget-password', passwordResetLimiter, wrapAsync(...));
```

### 5. CSRF Protection
```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// Apply to all state-changing routes
router.use(csrfProtection);

// Make token available to views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// In forms
// <input type="hidden" name="_csrf" value="<%= csrfToken %>">
```

### 6. Security Headers
```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 7. Input Sanitization
```javascript
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Prevent NoSQL injection attacks
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Custom sanitization for specific fields
const sanitizeInput = (input) => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '');
};
```

### 8. Logging and Monitoring
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Log authentication events
const logAuthEvent = (event, user, ip) => {
  logger.info({
    event,
    user: user.username || user.email,
    ip,
    timestamp: new Date().toISOString()
  });
};

// Usage
router.post('/login', (req, res) => {
  logAuthEvent('login_attempt', req.body, req.ip);
  // ... rest of login logic
});
```

### 9. Secure Cookie Configuration
```javascript
app.use(session({
  // ... other options
  cookie: {
    secure: true, // HTTPS only
    httpOnly: true, // No JS access
    sameSite: 'strict', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/'
  }
}));
```

### 10. API Security
```javascript
// API Key Authentication for external services
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// CORS Configuration
const cors = require('cors');
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
}));
```

---

## 🚀 Complete Security Checklist

### Authentication & Sessions
✅ **Use HTTPS in production** - Encrypt all data in transit
✅ **Secure session configuration** - httpOnly, secure, sameSite cookies
✅ **Strong session secrets** - Long, random strings stored in env vars
✅ **Session store** - Use MongoDB/Redis for production
✅ **Session expiration** - Implement idle and absolute timeouts

### Password Management
✅ **Strong password policy** - Minimum length, complexity requirements
✅ **Secure password storage** - bcrypt/PBKDF2 with salt
✅ **Password reset security** - Time-limited OTPs, single use
✅ **Account lockout** - Prevent brute force attacks
✅ **Password history** - Prevent reuse of recent passwords

### Input Validation & Sanitization
✅ **Server-side validation** - Never trust client input
✅ **Schema validation** - Use Joi for structured validation
✅ **SQL/NoSQL injection prevention** - Parameterized queries, sanitization
✅ **XSS prevention** - Escape output, sanitize input
✅ **File upload validation** - Type, size, content verification

### Access Control
✅ **Authorization middleware** - Check permissions consistently
✅ **Principle of least privilege** - Users only access what they need
✅ **Resource ownership verification** - Users can only modify their own data
✅ **Admin panel protection** - Separate authentication, 2FA

### Security Headers & CSRF
✅ **Helmet.js** - Set security headers automatically
✅ **CSRF tokens** - Protect state-changing operations
✅ **CORS configuration** - Restrict cross-origin requests
✅ **Content Security Policy** - Prevent XSS and injection attacks

### Rate Limiting & DoS Protection
✅ **Login rate limiting** - Prevent brute force attacks
✅ **API rate limiting** - Prevent abuse and DoS
✅ **Request size limits** - Prevent large payload attacks
✅ **Timeout configuration** - Prevent slowloris attacks

### Logging & Monitoring
✅ **Authentication event logging** - Track login/logout/failures
✅ **Error logging** - Capture and analyze errors
✅ **Security event monitoring** - Detect suspicious patterns
✅ **Regular log review** - Identify potential security issues

### Email Security
✅ **App-specific passwords** - Don't use main account password
✅ **TLS/SSL for email** - Encrypt email transmission
✅ **Rate limit email sending** - Prevent spam abuse
✅ **Email validation** - Verify email format and existence

### Development & Deployment
✅ **Environment variables** - Never commit secrets
✅ **Dependency updates** - Regular security patches
✅ **Security testing** - Penetration testing, vulnerability scanning
✅ **Secure deployment** - Use CI/CD with security checks
✅ **Regular backups** - Encrypted, tested restore procedures

### Compliance & Privacy
✅ **GDPR compliance** - User data rights, consent
✅ **Privacy policy** - Clear data usage disclosure
✅ **Data encryption** - At rest and in transit
✅ **Secure data deletion** - Proper data lifecycle management

---

## 📚 Additional Resources

1. [Passport.js Documentation](http://www.passportjs.org/docs/)
2. [Express Session Documentation](https://github.com/expressjs/session)
3. [Connect-Flash Documentation](https://github.com/jaredhanson/connect-flash)
4. [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
5. [Nodemailer Documentation](https://nodemailer.com/about/)
6. [Helmet.js Security Headers](https://helmetjs.github.io/)
7. [Express Rate Limit](https://github.com/nfriedly/express-rate-limit)
8. [OWASP Top 10 Security Risks](https://owasp.org/www-project-top-ten/)

---

## 🎉 Conclusion

Your WanderLust application now has a comprehensive authentication and authorization system that:
- Securely manages user sessions with best practices
- Protects routes based on authentication status
- Controls access based on resource ownership
- Provides clear feedback through flash messages
- Implements secure password reset via email OTP
- Follows industry-standard security practices
- Includes rate limiting and CSRF protection
- Handles edge cases gracefully

Remember: Security is an ongoing process. Always stay updated with best practices and security patches! Regular security audits and dependency updates are essential for maintaining a secure application.