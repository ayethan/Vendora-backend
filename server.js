const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
require('dotenv').config();
const mongodb = require('mongoose');

const app = express();

// Middleware
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))
app.use(express.json());
app.use(cookieParser())

// Routes
const routes = require('./routes/index');
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
const dbUri = process.env.MONGO_URI;

if(!dbUri) {
  console.error("MONGO_URI is not defined in environment variables");
  process.exit(1);
}

mongodb.connect(dbUri)
.then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("Failed to connect to MongoDB", err);
});