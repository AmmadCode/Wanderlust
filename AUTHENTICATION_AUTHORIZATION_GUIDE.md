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
10. [Security Best Practices](#security-best-practices)

---

## 📋 Overview

WanderLust uses a robust authentication and authorization system to protect user data and control access to various features. This guide explains how everything works together.

### Key Components:
- **Express Sessions** - Stores user data across requests
- **Passport.js** - Handles authentication strategies
- **Connect-Flash** - Displays success/error messages
- **Custom Middleware** - Controls access to protected routes

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

## 🔒 Security Best Practices

### 1. Session Security:
```javascript
const sessionOptions = {
  secret: process.env.SESSION_SECRET, // Use environment variable
  resave: false,
  saveUninitialized: false,          // Don't save empty sessions
  cookie: {
    secure: true,                   // Only send over HTTPS in production
    httpOnly: true,                 // Prevent XSS attacks
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
};
```

### 2. Password Security:
- Passwords are never stored in plain text
- passport-local-mongoose automatically handles:
  - Salt generation
  - Password hashing using PBKDF2
  - Secure password comparison

### 3. Authorization Checks:
- Always verify ownership before allowing edits/deletes
- Check authentication status before showing sensitive data
- Use middleware consistently across all protected routes

### 4. CSRF Protection:
```javascript
// Consider adding CSRF protection
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

router.post('/listings', csrfProtection, isLoggedIn, (req, res) => {
  // Handle request
});
```

### 5. Input Validation:
- Always validate user input
- Use schema validation (Joi)
- Sanitize data before storing in database

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

## 🚀 Best Practices Checklist

✅ **Always use HTTPS in production**
✅ **Store secrets in environment variables**
✅ **Implement proper error handling**
✅ **Use middleware consistently**
✅ **Validate all user input**
✅ **Check authorization for every protected action**
✅ **Clear sensitive session data after use**
✅ **Implement rate limiting for login attempts**
✅ **Log authentication events for security monitoring**
✅ **Keep dependencies updated**

---

## 📚 Additional Resources

1. [Passport.js Documentation](http://www.passportjs.org/docs/)
2. [Express Session Documentation](https://github.com/expressjs/session)
3. [Connect-Flash Documentation](https://github.com/jaredhanson/connect-flash)
4. [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

## 🎉 Conclusion

Your WanderLust application now has a robust authentication and authorization system that:
- Securely manages user sessions
- Protects routes based on authentication status
- Controls access based on resource ownership
- Provides clear feedback through flash messages
- Handles edge cases gracefully

Remember: Security is an ongoing process. Always stay updated with best practices and security patches!