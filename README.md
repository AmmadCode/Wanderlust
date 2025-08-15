# WanderLust 🏡

A modern vacation rental marketplace built with Node.js, Express, and MongoDB. WanderLust allows users to discover, list, and book unique accommodations around the world.



## 🌟 Features

### Core Functionality
- **Property Listings**: Browse and search vacation rentals with detailed information
- **Advanced Filtering**: Filter properties by categories (Trending, Mountains, Beaches, Castles, etc.)
- **Search by Location**: Find properties by country
- **Interactive Maps**: View property locations with integrated geocoding
- **Image Management**: Upload and manage property images via Cloudinary

### User Management
- **Authentication**: Secure user registration and login with Passport.js
- **Password Reset**: Email-based OTP system for password recovery
- **Session Management**: Persistent user sessions with secure cookies

### Reviews & Ratings
- **User Reviews**: Leave detailed reviews and ratings for properties
- **Star Rating System**: Interactive 5-star rating interface
- **Review Management**: Edit and delete your own reviews

### Categories
- 🔥 Trending
- 🛏️ Rooms
- 🏙️ Iconic Cities
- ⛰️ Mountains
- 🏰 Castles
- 🏊 Amazing Pools
- 🏕️ Camping
- 🚜 Farmhouses
- ❄️ Arctic
- 🚢 Boats
- ☀️ Deserts

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Frontend
- **EJS** - Templating engine
- **Bootstrap** - CSS framework
- **JavaScript** - Client-side scripting

### Authentication & Security
- **Passport.js** - Authentication middleware
- **Passport-Local** - Local authentication strategy
- **Express-Session** - Session management
- **Connect-Flash** - Flash messages

### Cloud Services
- **Cloudinary** - Image storage and management
- **MongoDB Atlas** - Cloud database hosting

### Additional Libraries
- **Joi** - Data validation
- **Nodemailer** - Email service
- **Multer** - File upload handling
- **Axios** - HTTP client
- **Method-Override** - HTTP verb support

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- MongoDB (local or Atlas account)
- Cloudinary account
- Gmail account (for email service)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AmmadCode/Wanderlust.git  
   cd wanderlust
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # MongoDB Configuration
   MONGODB_USERNAME=your_mongodb_username
   MONGODB_PASSWORD=your_mongodb_password
   MONGODB_CLUSTER=your_cluster_name
   MONGODB_DATABASE=your_database_name

   # Session Configuration
   SESSION_SECRET=your_session_secret_key

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Email Configuration
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password

   # Geocoding API (if applicable)
   GEOCODING_API_KEY=your_geocoding_api_key
   ```

4. **Initialize the database**
   ```bash
   node init/index.js
   ```

5. **Start the application**
   ```bash
   node app.js
   ```

   The application will be available at `http://localhost:8080`

## 📁 Project Structure

```
wanderlust/
├── app.js                 # Main application file
├── package.json          # Project dependencies
├── .env                  # Environment variables (create this)
├── .gitignore           # Git ignore file
│
├── controllers/         # Route controllers
│   ├── listing.js       # Listing CRUD operations
│   ├── review.js        # Review operations
│   ├── user.js          # User authentication
│   └── resetPassword.js # Password reset logic
│
├── models/              # Database models
│   ├── listing.js       # Listing schema
│   ├── review.js        # Review schema
│   ├── user.js          # User schema
│   └── otp.js           # OTP schema
│
├── routes/              # Application routes
│   ├── listing.js       # Listing routes
│   ├── review.js        # Review routes
│   ├── user.js          # User routes
│   └── resetPassword.js # Password reset routes
│
├── views/               # EJS templates
│   ├── layouts/         # Layout templates
│   ├── listings/        # Listing views
│   ├── users/           # User views
│   └── includes/        # Partial templates
│
├── public/              # Static assets
│   ├── css/            # Stylesheets
│   └── javaScript/     # Client-side scripts
│
├── utils/               # Utility functions
│   ├── ExpressError.js  # Custom error class
│   ├── wrapAsync.js     # Async error handler
│   ├── emailService.js  # Email functionality
│   └── geocoding.js     # Geocoding service
│
├── middleware.js        # Custom middleware
├── schema.js           # Joi validation schemas
└── cloudConfig.js      # Cloudinary configuration
```

## 🔧 Configuration

### Database Setup
The application uses MongoDB Atlas by default. To use a local MongoDB instance:
1. Install MongoDB locally
2. Update the connection string in `app.js`

### Email Configuration
1. Enable 2-factor authentication on your Gmail account
2. Generate an app-specific password
3. Use this password in the `EMAIL_PASS` environment variable

### Cloudinary Setup
1. Sign up for a free Cloudinary account
2. Get your cloud name, API key, and API secret
3. Add these to your `.env` file

## 🚦 API Endpoints

### Listings
- `GET /listings` - View all listings
- `GET /listings/new` - Show create listing form
- `POST /listings` - Create new listing
- `GET /listings/:id` - View specific listing
- `GET /listings/:id/edit` - Show edit form
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing

### Reviews
- `POST /listings/:id/reviews` - Create review
- `DELETE /listings/:id/reviews/:reviewId` - Delete review

### Authentication
- `GET /signup` - Show signup form
- `POST /signup` - Register new user
- `GET /login` - Show login form
- `POST /login` - User login
- `GET /logout` - User logout

### Password Reset
- `GET /forget-password` - Show forgot password form
- `POST /reset-password-otp` - Send OTP email
- `GET /verify-otp` - Show OTP verification form
- `POST /verify-otp` - Verify OTP
- `POST /reset-password` - Reset password

## 🔒 Security Features

- Password hashing with Passport-Local-Mongoose
- Session-based authentication
- CSRF protection via method-override
- Input validation with Joi
- Secure cookie settings
- Environment variable protection
- File upload restrictions (images only, 5MB max)

## 🧪 Testing

Currently, the project doesn't include automated tests. To add testing:

```bash
npm install --save-dev jest supertest
```

Then update `package.json`:
```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch"
}
```

## 🚀 Deployment

### Deploying to Render/Railway/Heroku

1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use secure session secrets
- Enable HTTPS
- Configure proper CORS settings

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Use ES6+ syntax
- Follow MVC architecture
- Write descriptive commit messages
- Add comments for complex logic
- Ensure responsive design



### 📸 Sample Image
![Wanderlust Screenshot](https://res.cloudinary.com/dypudy94h/image/upload/v1755252232/Screen_Shot_2025-08-15_at_14.12.19_ozujjd.png)


<p align="center">
  <img src="https://res.cloudinary.com/dypudy94h/image/upload/v1755252234/Screen_Shot_2025-08-15_at_14.13.33_mf9ejc.png" alt="Wanderlust Screenshot 2" width="30%" style="margin: 10px;">
</p>

<p align="center">
  <img src="https://res.cloudinary.com/dypudy94h/image/upload/v1755252223/Screen_Shot_2025-08-15_at_14.12.56_mfow0w.png" alt="Wanderlust Screenshot 3" width="30%" style="margin: 10px;">
</p>

<p align="center">
  <img src="https://res.cloudinary.com/dypudy94h/image/upload/v1755252209/Screen_Shot_2025-08-15_at_14.13.54_e3bwp8.png" alt="Wanderlust Screenshot 4" width="30%" style="margin: 10px;">
</p>

<p align="center">
  <img src="https://res.cloudinary.com/dypudy94h/image/upload/v1755252209/Screen_Shot_2025-08-15_at_14.13.43_ijvlt8.png" alt="Wanderlust Screenshot 5" width="30%" style="margin: 10px;">
</p>



## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👤 Author

**Muhammad Ammad**

- GitHub: [@AmmadCode](https://github.com/AmmadCode)


## 🙏 Acknowledgments

- Built as part of a web development course
- Thanks to all contributors



Made with ❤️ by Muhammad Ammad
