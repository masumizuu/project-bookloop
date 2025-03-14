const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',   // Allow your frontend
    credentials: true                   // If using cookies or authorization headers
}));

app.use(express.json());

app.use('/api/auth', require('./routes/userRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/borrow', require('./routes/borrowRoutes'));
app.use('/api/admin', require('./routes/adminRoutes')); // Protected

app.listen(3000, () => console.log('🚀 Server running on port 3000'));