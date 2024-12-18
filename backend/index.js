require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000; // Use environment variable for port

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'https://my-book-8.onrender.com/books' 
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose Schemas
const BookTypeSchema = new mongoose.Schema({
    type_name: {
        type: String,
        required: true
    },
});

const GenreSchema = new mongoose.Schema({
    genre_name: {
        type: String,
        required: true
    },
});

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BookType',
        required: true,
    },
    genre_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: true,
    },
    publication: {
        type: String,
        default: '',
    },
    pages: {
        type: Number,
        required: true,
        min: [1, 'Pages must be a positive number.'],
    },
    price: {
        type: Number,
        required: true,
        min: [1, 'Price must be a positive number.'],
    },
    cover_photo: {
        type: String,
        required: true,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
});

const BookType = mongoose.model('BookType', BookTypeSchema);
const Genre = mongoose.model('Genre', GenreSchema);
const Book = mongoose.model('Book', BookSchema);

// Routes

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Book Management API!');
});

// Fetch all book types
app.get('/book-types', async (req, res) => {
    try {
        const bookTypes = await BookType.find();
        res.json(bookTypes);
    } catch (err) {
        console.error('Error fetching book types:', err);
        res.status(500).json({
            error: 'Failed to fetch book types'
        });
    }
});

// Fetch all genres
app.get('/genres', async (req, res) => {
    try {
        const genres = await Genre.find();
        res.json(genres);
    } catch (err) {
        console.error('Error fetching genres:', err);
        res.status(500).json({
            error: 'Failed to fetch genres'
        });
    }
});

// Fetch all books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find()
            .populate('type_id', 'type_name')
            .populate('genre_id', 'genre_name');
        res.json(books);
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).json({
            error: 'Failed to fetch books'
        });
    }
});

// Fetch a book by ID
app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('type_id', 'type_name')
            .populate('genre_id', 'genre_name');
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({
                error: 'Book not found'
            });
        }
    } catch (err) {
        console.error('Error fetching book:', err);
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
            type_id,
            genre_id,
            pages,
            price,
            cover_photo
        } = req.body;

        // Validate required fields
        if (!title || !author || !type_id || !genre_id || !pages || !price || !cover_photo) {
            return res.status(400).json({
                error: 'All fields except publication are required.'
            });
        }

        // Create and save the book
        const newBook = new Book(req.body);
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        console.error('Error adding book:', err.message);
        res.status(500).json({
            error: 'Failed to add book',
            details: err.message
        });
    }
});

// Update a book by ID
app.put('/books/:id', async (req, res) => {
    try {
        const {
            title,
            author,
            type_id,
            genre_id,
            pages,
            price,
            cover_photo
        } = req.body;

        // Validate required fields
        if (!title || !author || !type_id || !genre_id || !pages || !price || !cover_photo) {
            return res.status(400).json({
                error: 'All fields except publication are required.'
            });
        }

        // Update the book
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        if (updatedBook) {
            res.json(updatedBook);
        } else {
            res.status(404).json({
                error: 'Book not found'
            });
        }
    } catch (err) {
        console.error('Error updating book:', err.message);
        res.status(500).json({
            error: 'Failed to update book',
            details: err.message
        });
    }
});

// Deactivate a book by ID
app.put('/books/:id/deactivate', async (req, res) => {
    try {
        const deactivatedBook = await Book.findByIdAndUpdate(req.params.id, {
            is_active: false
        }, {
            new: true
        });
        if (deactivatedBook) {
            res.json({
                message: 'Book deactivated successfully'
            });
        } else {
            res.status(404).json({
                error: 'Book not found'
            });
        }
    } catch (err) {
        console.error('Error deactivating book:', err.message);
        res.status(500).json({
            error: 'Failed to deactivate book',
            details: err.message
        });
    }
});

// Add a new book type
app.post('/book-types', async (req, res) => {
    try {
        const {
            type_name
        } = req.body;

        // Validate required field
        if (!type_name) {
            return res.status(400).json({
                error: 'Type name is required.'
            });
        }

        const newBookType = new BookType({
            type_name
        });
        const savedBookType = await newBookType.save();
        res.status(201).json(savedBookType);
    } catch (err) {
        console.error('Error adding book type:', err.message);
        res.status(500).json({
            error: 'Failed to add book type',
            details: err.message
        });
    }
});

// Add a new genre
app.post('/genres', async (req, res) => {
    try {
        const {
            genre_name
        } = req.body;

        // Validate required field
        if (!genre_name) {
            return res.status(400).json({
                error: 'Genre name is required.'
            });
        }

        const newGenre = new Genre({
            genre_name
        });
        const savedGenre = await newGenre.save();
        res.status(201).json(savedGenre);
    } catch (err) {
        console.error('Error adding genre:', err.message);
        res.status(500).json({
            error: 'Failed to add genre',
            details: err.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at https://my-book-8.onrender.com:${port}`);
});
