require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Book Schema
const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    publication: {
        type: String,
        default: ''
    },
    pages: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    cover_photo: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    }
});

const Book = mongoose.model('Book', BookSchema);

// Routes
app.get('/', (req, res) => res.send('Welcome to the Book Management API!'));

// Fetch all books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find({
            is_active: true
        });
        res.json(books);
    } catch (err) {
        res.status(500).json({
            error: 'Failed to fetch books'
        });
    }
});

// Fetch a book by ID
app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({
            error: 'Book not found'
        });
        res.json(book);
    } catch (err) {
        res.status(500).json({
            error: 'Failed to fetch book'
        });
    }
});

// Add a new book
app.post('/books', async (req, res) => {
    try {
        const {
            title,
            author,
            genre,
            type,
            pages,
            price,
            cover_photo
        } = req.body;
        if (!title || !author || !genre || !type || !pages || !price || !cover_photo) {
            return res.status(400).json({
                error: 'All fields except publication are required.'
            });
        }
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(500).json({
            error: 'Failed to add book',
            details: err.message
        });
    }
});

// Deactivate a book
app.put('/books/:id/deactivate', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, {
            is_active: false
        }, {
            new: true
        });
        if (!updatedBook) return res.status(404).json({
            error: 'Book not found'
        });
        res.json(updatedBook);
    } catch (err) {
        res.status(500).json({
            error: 'Failed to deactivate book'
        });
    }
});

// Fallback for undefined routes
app.use((req, res) => res.status(404).json({
    error: 'Endpoint not found'
}));

// Global Error Handler
app.use((err, req, res, next) => {
    res.status(500).json({
        error: 'An unexpected error occurred'
    });
});

// Start Server
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));