const express = require('express');
const db = require('./config/db'); // Adjust the path as needed
const cors = require('cors');
const apiRouter = require('./routes/userRoutes');


const app = express();
const port = 3003;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/user', apiRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
