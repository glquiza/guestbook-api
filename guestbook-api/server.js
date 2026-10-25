import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// TODO 1: Setup Middleware
app.use(cors()); // Enables cross-origin requests from React
app.use(express.json()); // Parses incoming JSON bodies from requests

// Database connection pool
const pool = new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

// Test connection on startup
pool.connect()
    .then(() => console.log('✅ Connected to PostgreSQL database'))
    .catch((err) => console.error('❌ Database connection error:', err.message));

// TODO 2: Create a GET route for '/api/messages'
app.get('/api/messages', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM guestbook ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
});

// TODO 3: Create a POST route for '/api/messages'
app.post('/api/messages', async (req, res) => {
    try {
        const { name, message } = req.body;

        // Simple validation
        if (!name || !message) {
            return res.status(400).json({ error: 'Name and message are required' });
        }

        // Parameterized query ($1, $2) protects against SQL injection
        const queryText = 'INSERT INTO guestbook (name, message) VALUES ($1, $2) RETURNING *';
        const result = await pool.query(queryText, [name, message]);

        // Send back the newly created message
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error saving message:', err);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
});