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
    MONGODB_URI=mongodb://localhost:27017/bookbazaar
    NODE_ENV=development
    
    # Auth Secrets
    ACCESS_TOKEN_SECRET=<your_secret>
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=<your_secret>
    REFRESH_TOKEN_EXPIRY=10d
    EXPRESS_SESSION_SECRET=<your_secret>
    
    # Cloudinary
    CLOUDINARY_CLOUD_NAME=<your_cloud_name>
    CLOUDINARY_API_KEY=<your_api_key>
    CLOUDINARY_API_SECRET=<your_api_secret>
    
    # Email (Mailtrap/SMTP)
    MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
    MAILTRAP_SMTP_PORT=2525
    MAILTRAP_SMTP_USER=<your_user>
    MAILTRAP_SMTP_PASS=<your_pass>
    
    # Payments
    RAZORPAY_KEY_ID=<your_key>
    RAZORPAY_KEY_SECRET=<your_secret>
    
    # OAuth
    GOOGLE_CLIENT_ID=<your_id>
    GOOGLE_CLIENT_SECRET=<your_secret>
    GOOGLE_CALLBACK_URL=http://localhost:8080/api/v1/auth/google/callback
    
    GITHUB_CLIENT_ID=<your_id>
    GITHUB_CLIENT_SECRET=<your_secret>
    GITHUB_CALLBACK_URL=http://localhost:8080/api/v1/auth/github/callback
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
