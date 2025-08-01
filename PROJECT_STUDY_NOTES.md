# 🏠 WanderLust - Complete Project Study Notes

## 📋 Project Overview
**WanderLust** is a full-stack web application for listing and managing rental properties (like Airbnb). Built with Node.js, Express, MongoDB, and EJS templating.

---

## 🛠️ Technology Stack

### Backend Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling library
- **Joi** - Data validation library
- **EJS** - Embedded JavaScript templating engine
- **EJS-Mate** - Layout support for EJS

### Frontend Technologies
- **Bootstrap 5** - CSS framework for responsive design
- **Font Awesome** - Icon library
- **Custom CSS** - Additional styling

### Development Tools
- **Method Override** - HTTP verb support (PUT, DELETE)
- **dotenv** - Environment variable management

---

## 📁 Project Structure

```
Mega-Project/
├── app.js                 # Main application file
├── schema.js              # Joi validation schemas
├── package.json           # Dependencies and scripts
├── models/
│   └── listing.js         # Mongoose model for listings
├── views/
│   ├── layouts/
│   │   └── boilerplate.ejs # Main layout template
│   ├── includes/
│   │   ├── navbar.ejs     # Navigation component
│   │   └── footer.ejs     # Footer component
│   └── listings/
│       ├── index.ejs      # All listings page
│       ├── show.ejs       # Single listing details
│       ├── new.ejs        # Create new listing form
│       ├── edit.ejs       # Edit listing form
│       └── error.ejs      # Error display page
├── public/
│   ├── css/
│   │   └── style.css      # Custom styles
│   └── javaScript/
│       ├── script.js      # Client-side JavaScript
│       └── deleteMessage.js # Delete confirmation logic
├── utils/
│   ├── ExpressError.js    # Custom error class
│   └── wrapAsync.js       # Async error handling wrapper
└── init/
    ├── index.js           # Database initialization
    └── data.js            # Sample data for seeding
```

---

## 🗄️ Database Schema (Mongoose Model)

### Listing Model (`models/listing.js`)
```javascript
const listingSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: String,
    image: {
        url: {
            type: String,
            set: v => v === "" ? defaultImage.url : v
        },
        filename: {
            type: String,
            set: v => v === "" ? defaultImage.filename : v
        }
    },
    price: Number,
    location: String,
    country: String
});
```

**Key Concepts:**
- **Schema Definition**: Structure of data in MongoDB
- **Data Types**: String, Number, Object
- **Required Fields**: `title` is mandatory
- **Default Values**: Image has default URL and filename
- **Setter Functions**: Automatically set default image if empty

---

## ✅ Joi Validation Schema (`schema.js`)

### Purpose
Server-side validation to ensure data integrity before saving to database.

### Validation Rules
```javascript
const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().trim().min(1).max(100),
        description: Joi.string().required().trim().min(1).max(1000),
        image: Joi.object({
            url: Joi.string().uri().allow('', null),
            filename: Joi.string().allow('', null)
        }).allow(null).optional(),
        price: Joi.number().required().positive().precision(2),
        location: Joi.string().required().trim().min(1).max(100),
        country: Joi.string().required().trim().min(1).max(100)
    }).required()
});
```

**Key Joi Methods:**
- `.required()` - Field must exist
- `.optional()` - Field is optional
- `.trim()` - Remove whitespace
- `.min(n)` / `.max(n)` - Length constraints
- `.positive()` - Must be > 0
- `.precision(n)` - Decimal places limit
- `.uri()` - Valid URL format
- `.allow('', null)` - Allow empty/null values
- `.messages({})` - Custom error messages

---

## 🛣️ Routes and HTTP Methods

### RESTful Routes Pattern
| Method | Route | Purpose | Description |
|--------|-------|---------|-------------|
| GET | `/listings` | Index | Show all listings |
| GET | `/listings/new` | New | Show create form |
| POST | `/listings` | Create | Save new listing |
| GET | `/listings/:id` | Show | Show single listing |
| GET | `/listings/:id/edit` | Edit | Show edit form |
| PUT | `/listings/:id` | Update | Update existing listing |
| DELETE | `/listings/:id` | Destroy | Delete listing |

### Route Implementation Examples

#### Index Route
```javascript
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}));
```

#### Create Route with Joi Validation
```javascript
app.post("/listings", wrapAsync(async (req, res, next) => {
    // Joi validation
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }
    
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));
```

---

## 🎨 EJS Templating

### Layout System
- **Main Layout**: `views/layouts/boilerplate.ejs`
- **Includes**: Reusable components (navbar, footer)
- **Content Injection**: `<%- body %>` in layout

### EJS Syntax
```ejs
<% // JavaScript code (not rendered) %>
<%= // Output escaped HTML %>
<%- // Output unescaped HTML %>
<%# // Comments %>
<% layout('layouts/boilerplate') %> // Use layout
<%- include('../includes/navbar') %> // Include partial
```

### Data Passing
```javascript
// In route
res.render("listings/show.ejs", { listing });

// In template
<%= listing.title %>
<%= listing.price.toLocaleString("en-US", {style: "currency", currency: "USD"}) %>
```

---

## 🔧 Utility Functions

### wrapAsync (`utils/wrapAsync.js`)
**Purpose**: Catch errors in async route handlers
```javascript
const wrapAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
```

### ExpressError (`utils/ExpressError.js`)
**Purpose**: Custom error class with status codes
```javascript
class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}
```

---

## 🎯 Form Handling

### HTML Form Structure
```html
<!-- Create Form -->
<form action="/listings" method="POST">
    <input name="listing[title]" required>
    <textarea name="listing[description]" required></textarea>
    <input name="listing[image][url]">
    <input name="listing[price]" required>
    <input name="listing[location]" required>
    <input name="listing[country]" required>
    <button type="submit">Add Listing</button>
</form>

<!-- Edit Form (needs method override) -->
<form action="/listings/<%= listing._id %>?_method=PUT" method="POST">
    <!-- Same fields with values populated -->
</form>

<!-- Delete Form -->
<form action="/listings/<%= listing._id %>?_method=DELETE" method="POST">
    <button type="submit">Delete</button>
</form>
```

### Method Override
- HTML forms only support GET and POST
- `method-override` middleware enables PUT and DELETE
- Use `?_method=PUT` or `?_method=DELETE` in action URL

---

## 🚨 Error Handling

### Error Handling Middleware
```javascript
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("listings/error.ejs", { message });
});
```

### 404 Handler
```javascript
app.use((req, res, next) => {
    next(new ExpressError("Page Not Found!", 404));
});
```

---

## 🌐 MongoDB Connection

### Connection String
```javascript
const connectionString = `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(connectionString)
    .then(() => console.log('Successfully connected to MongoDB Atlas!'))
    .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));
```

### Environment Variables (.env)
```
MONGODB_USERNAME=your_username
MONGODB_PASSWORD=your_password
MONGODB_CLUSTER=your_cluster
MONGODB_DATABASE=your_database
```

---

## 🎨 Frontend Features

### Bootstrap Integration
- Responsive grid system (`row`, `col-*`)
- Form styling (`form-control`, `btn`)
- Card components for listings
- Modal for delete confirmation

### Custom CSS Features
- Hover effects on listing cards
- Custom form styling with floating labels
- Responsive design
- Font Awesome icons

### JavaScript Features
- Delete confirmation modal
- Form validation feedback
- Interactive UI elements

---

## 📊 Data Flow

### Create New Listing Flow
1. User visits `/listings/new`
2. Server renders `new.ejs` form
3. User fills form and submits (POST to `/listings`)
4. Server validates data with Joi
5. If valid: Save to MongoDB, redirect to `/listings`
6. If invalid: Show error message

### Display Listings Flow
1. User visits `/listings`
2. Server queries MongoDB for all listings
3. Server renders `index.ejs` with listings data
4. Template loops through listings and displays cards

---

## 🔍 Key Concepts to Remember

### 1. MVC Pattern
- **Model**: `listing.js` (data structure)
- **View**: EJS templates (presentation)
- **Controller**: Route handlers in `app.js` (logic)

### 2. Middleware
- Functions that execute during request-response cycle
- `express.urlencoded()` - Parse form data
- `express.static()` - Serve static files
- `methodOverride()` - Enable PUT/DELETE
- `wrapAsync()` - Error handling

### 3. RESTful Design
- Consistent URL patterns
- HTTP methods match actions
- Predictable API structure

### 4. Data Validation
- **Client-side**: HTML5 validation, Bootstrap feedback
- **Server-side**: Joi validation before database operations

### 5. Template Engine
- EJS for dynamic HTML generation
- Layout system for consistent structure
- Data injection from server to template

---

## 🚀 Deployment Considerations

### Environment Setup
- Use environment variables for sensitive data
- Separate development and production configurations
- MongoDB Atlas for cloud database

### Security Best Practices
- Validate all input data
- Use HTTPS in production
- Sanitize user input
- Handle errors gracefully

---

## 📝 Sample Data Structure

### Listing Object Example
```javascript
{
    _id: ObjectId("..."),
    title: "Cozy Beachfront Cottage",
    description: "Escape to this charming beachfront cottage...",
    image: {
        url: "https://images.unsplash.com/photo-...",
        filename: "listingimage"
    },
    price: 1500,
    location: "Malibu",
    country: "United States"
}
```

---

## 🎯 Testing Your Knowledge

### Questions to Ask Yourself:
1. What is the difference between Mongoose schema and Joi schema?
2. How does `wrapAsync` help with error handling?
3. What happens when a form is submitted with invalid data?
4. How does the layout system work in EJS?
5. What is the purpose of method override?
6. How are environment variables used for database connection?
7. What is the difference between `<%=` and `<%-` in EJS?
8. How does Bootstrap grid system work?
9. What is RESTful routing and why is it important?
10. How does middleware work in Express?

---

## 🔧 Common Debugging Tips

1. **Database Connection Issues**: Check environment variables
2. **Validation Errors**: Check Joi schema matches form data
3. **Template Errors**: Verify variable names and data structure
4. **Route Not Found**: Check URL patterns and HTTP methods
5. **Static Files Not Loading**: Verify `express.static` middleware
6. **Form Submission Issues**: Check form action and method
7. **Async Errors**: Ensure `wrapAsync` is used for async routes

---

## 📚 Key Dependencies to Remember

```json
{
    "express": "Web framework",
    "mongoose": "MongoDB object modeling",
    "joi": "Data validation",
    "ejs": "Templating engine",
    "ejs-mate": "Layout support",
    "method-override": "HTTP verb support",
    "dotenv": "Environment variables"
}
```

---

## 🎉 Project Achievements

✅ **Full CRUD Operations** - Create, Read, Update, Delete listings
✅ **Data Validation** - Both client and server-side validation
✅ **Responsive Design** - Works on all device sizes
✅ **Error Handling** - Graceful error management
✅ **Template System** - Reusable and maintainable views
✅ **Database Integration** - MongoDB with Mongoose ODM
✅ **RESTful API** - Standard HTTP methods and routes
✅ **Security** - Input validation and error handling

---

*Study these concepts thoroughly and practice implementing similar features to master full-stack web development!*