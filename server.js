const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

// ✅ Allow frontend origin for CORS
const allowedOrigins = ['http://localhost:5173', 'https://merblog.netlify.app'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // Optional: if you're using cookies/auth headers
}));

app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/blogs', require('./routes/blog'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
