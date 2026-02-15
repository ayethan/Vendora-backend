# Vendora Backend

This is the backend for the Vendora application, built using the MERN stack (MongoDB, Express.js, React, Node.js). It provides the API endpoints and handles data persistence for the frontend.

## Technologies Used

*   **Node.js**: JavaScript runtime
*   **Express.js**: Web framework for Node.js
*   **MongoDB**: NoSQL database
*   **Mongoose**: MongoDB object data modeling (ODM) for Node.js
*   **JSON Web Tokens (JWT)**: For authentication
*   **`express-validator`**: Middleware for request data validation
*   **Stripe**: Payment processing
*   **Passport.js**: For Google OAuth
*   **Nodemailer (via SendGrid)**: For email services

## Prerequisites

Before setting up the project, ensure you have the following installed:

*   **Node.js**: v14.x or higher
*   **npm** (Node Package Manager): Comes with Node.js
*   **MongoDB**: Local installation or access to a cloud-hosted MongoDB service (e.g., MongoDB Atlas)

## Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/ayethan/Vendora-backend.git
    cd Vendora/backend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Configuration

1.  **Create a `.env` file**:
    Copy the `.env.example` file and rename it to `.env` in the `backend/` directory.
    ```bash
    cp .env.example .env
    ```

2.  **Update environment variables**:
    Open the newly created `.env` file and fill in the values for your specific setup:
    *   `MONGODB_URI`: Your MongoDB connection string.
    *   `PORT`: The port the server will run on (default is 5000).
    *   `FRONTEND_URL`: The URL of your frontend application (e.g., `http://localhost:5173`).
    *   `JWT_SECRET`: A strong, random string for JWT signing.
    *   `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`: Your Google OAuth credentials.
    *   `SESSION_SECRET`: A strong, random string for session management.
    *   `STRIPE_SECRET_KEY`: Your Stripe secret key.
    *   `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM_NAME`, `EMAIL_FROM_ADDRESS`: Your email service (e.g., SendGrid) credentials.
    *   `GEMINI_API_KEY`: Your Gemini API key, if using AI features.

## Running the Project

To start the backend server:

```bash
npm start
```

The server will typically run on `http://localhost:5000` (or the port specified in your `.env` file).

## API Endpoints

The backend exposes a RESTful API. You can explore the available endpoints by examining the `backend/routes/index.js` file and the various controller files in `backend/controllers/`.

Common routes include:

*   `/api/admin/*`: Admin-specific routes for managing categories, products, restaurants, users, etc. (Requires authentication and admin privileges).
*   `/api/auth/*`: Authentication related routes (sign-in, sign-up, Google OAuth).
*   `/api/member/*`: Member-specific routes.
*   `/api/partner/*`: Partner-specific routes.
*   Public routes for products, restaurants, etc.

You can use tools like Postman or Insomnia to test the API endpoints.

## Contributing

(Add contributing guidelines here once the project is open-sourced)

## License

(Add license information here)
