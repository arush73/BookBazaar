# BookBazaar Backend 📚

A robust, scalable, and feature-rich backend API for an e-commerce bookstore platform. Built with Node.js, Express, and MongoDB, it provides a comprehensive set of endpoints for managing users, books, orders, carts, and payments.

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-installation--setup">Installation</a> •
  <a href="#-api-endpoints">API Endpoints</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

<div id= "-key-features">

## 🚀 Key Features

-   **Authentication & Authorization**:
    -   Secure user registration and login (Email/Password).
    -   OAuth integration (Google, GitHub) via Passport.js.
    -   Role-Based Access Control (RBAC) for Admin and User roles.
    -   JWT-based stateless authentication with Access and Refresh tokens.
    -   Password reset flow with email notifications.
-   **Product Management**:
    -   CRUD operations for Books (Admin only for write operations).
    -   Image upload support (Main image + Sub-images) using Cloudinary and Multer.
    -   Book categorization and detailed views.
-   **Shopping Experience**:
    -   Full-featured Shopping Cart management.
    -   Address management for users.
    -   Order processing and history.
-   **Payments**:
    -   Integrated with **Razorpay** for secure payment processing.
    -   (PayPal configuration present in env, potentially supported).
-   **Reviews & Ratings**:
    -   Users can leave reviews and ratings for books.
    -   Moderation capabilities.
-   **Security & Performance**:
    -   Rate limiting to prevent abuse.
    -   CORS configuration.
    -   Secure HTTP headers (Helmet implied/recommended).
    -   Request logging with Morgan and Winston.

</div>

<div id= "-tech-stack">

## 🛠️ Tech Stack
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
-   **Authentication**: [Passport.js](https://www.passportjs.org/), JWT, Bcrypt
-   **File Storage**: [Cloudinary](https://cloudinary.com/)
-   **Email Service**: [Nodemailer](https://nodemailer.com/) with [Mailgen](https://github.com/eladnava/mailgen) templates
-   **Validation**: [Zod](https://zod.dev/)
-   **Logging**: [Winston](https://github.com/winstonjs/winston), [Morgan](https://github.com/expressjs/morgan)
</div>

<div id= "-project-structure">

## 📂 Project Structure

```
bookbazaar/
├── src/
│   ├── app.js           # Express app configuration and middleware setup
│   ├── index.js         # Entry point, database connection, and server start
│   ├── constants.js     # Application-wide constants (Enums, etc.)
│   ├── config/          # Configuration files (DB, etc.)
│   ├── controllers/     # Request handlers for each resource (Auth, Books, Orders, etc.)
│   ├── middlewares/     # Custom middleware (Auth, Error handling, Multer, etc.)
│   ├── models/          # Mongoose schemas (User, Book, Order, Cart, etc.)
│   ├── routes/          # API route definitions
│   ├── utils/           # Helper functions (ApiError, ApiResponse, AsyncHandler)
│   ├── validators/      # Zod validation schemas
│   ├── logger/          # Logger configuration
│   └── passport/        # Passport strategies configuration
├── public/              # Static assets
├── .env.sample          # Environment variable template
└── package.json         # Dependencies and scripts
```
</div>

<div id= "-installation--setup">

## ⚙️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/arush73/bookbazaar.git
    cd bookbazaar
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and populate it based on `.env.sample`.
    ```env
    PORT=8080
    MONGODB_URI=mongodb://localhost:27017
    NODE_ENV=development
    EXPRESS_SESSION_SECRET=__express_session_secret__
    
    ACCESS_TOKEN_SECRET=__access_token_secret__
    ACCESS_TOKEN_EXPIRY=__access_token_expiry__
    REFRESH_TOKEN_SECRET=__refresh_token_secret__
    REFRESH_TOKEN_EXPIRY=__refresh_token_expiry__
    
    CORS_ORIGIN=http://localhost:3000
    
    MAILTRAP_SMTP_HOST=__mailtrap_smtp_host__
    MAILTRAP_SMTP_PORT=__mailtrap_smtp_port__
    MAILTRAP_SMTP_USER=__mailtrap_smtp_user_id__
    MAILTRAP_SMTP_PASS=__mailtrap_smtp_user_password__
    
    GMAIL_USER=your_gmail_user_id
    GMAIL_PASSWORD=your_gmail_app_password
    
    RAZORPAY_KEY_ID=__razorpay_key_id__
    RAZORPAY_KEY_SECRET=__razorpay_key_secret__
    
    PAYPAL_CLIENT_ID=__paypal_client_id__
    PAYPAL_SECRET=__paypal_secret__
    
    GOOGLE_CLIENT_ID=__google_client_id__
    GOOGLE_CLIENT_SECRET=__google_client_secret__
    GOOGLE_CALLBACK_URL=http://localhost:8080/api/v1/users/google/callback
    
    GITHUB_CLIENT_ID=__github_client_id__
    GITHUB_CLIENT_SECRET=__github_client_secret__
    GITHUB_CALLBACK_URL=http://localhost:8080/api/v1/users/github/callback
    
    CLIENT_SSO_REDIRECT_URL=http://localhost:3000/user/profile
    
    FORGOT_PASSWORD_REDIRECT_URL=http://localhost:3000/forgot-password
    ```

4.  **Start the Server:**
    ```bash
    # Development mode (with Nodemon)
    npm run dev
    
    # Production mode
    npm start
    ```

<div id= "-api-endpoints">

## 📡 API Endpoints

### Authentication (`/api/v1/auth`)
-   `POST /register`: Register a new user.
-   `POST /login`: Login with email/password.
-   `POST /logout`: Logout user.
-   `POST /refresh-token`: Refresh access token.
-   `GET /google`, `/github`: Initiate OAuth login.

### Books (`/api/v1/books`)
-   `GET /`: Get all books (with pagination/filtering).
-   `POST /`: Add a new book (Admin only, multipart/form-data).
-   `GET /:bookId`: Get detailed book information.
-   `PATCH /:bookId`: Update book details (Admin only).
-   `DELETE /:bookId`: Delete a book (Admin only).
-   `POST /:bookId/reviews`: Add a review.

### Orders (`/api/v1/orders`)
-   `POST /provider/razorpay`: Create a Razorpay order.
-   `POST /provider/razorpay/verify`: Verify payment signature.
-   `GET /`: Get user's order history.

### Cart (`/api/v1/cart`)
-   `GET /`: Get current user's cart.
-   `POST /item/:bookId`: Add item to cart.
-   `DELETE /item/:bookId`: Remove item from cart.
-   `DELETE /clear`: Clear the cart.

### Address (`/api/v1/address`)
-   `POST /`: Add a new address.
-   `GET /`: Get all saved addresses.
-   `GET /:addressId`: Get specific address.
-   `PUT /:addressId`: Update address.
-   `DELETE /:addressId`: Delete address.

### Health Check (`/api/v1/healthcheck`)
-   `GET /`: Check server status.

</div>

<div id= "-contributing">

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

</div>

## 📄 License

This project is licensed under the ISC License.
