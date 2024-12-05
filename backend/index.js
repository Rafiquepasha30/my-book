require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {
    MongoClient,
    ObjectId
} = require('mongodb');

const app = express();
const port = process.env.PORT || 5000; // Use environment variable for port

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection using environment variables
let db;
const client = new MongoClient(process.env.MONGO_URI);

(async () => {
    try {
        await client.connect();
        db = client.db(process.env.DB_NAME);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
})();

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Book Management API!');
});

// Route to get book types
app.get('/book-types', async (req, res) => {
    try {
        const bookTypes = await db.collection('booktypes').find().toArray();
        res.json(bookTypes);
    } catch (err) {
        console.error('Error fetching book types:', err);
        res.status(500).json({
            error: 'Failed to fetch book types'
        });
    }
});

// Route to get genres
app.get('/genres', async (req, res) => {
    try {
        const genres = await db.collection('genres').find().toArray();
        res.json(genres);
    } catch (err) {
        console.error('Error fetching genres:', err);
        res.status(500).json({
            error: 'Failed to fetch genres'
        });
    }
});

// Route to get all books
app.get('/books', async (req, res) => {
    try {
        const books = await db.collection('books').aggregate([{
                $lookup: {
                    from: 'booktypes',
                    localField: 'type_id',
                    foreignField: '_id',
                    as: 'type_info',
                },
            },
            {
                $lookup: {
                    from: 'genres',
                    localField: 'genre_id',
                    foreignField: '_id',
                    as: 'genre_info',
                },
            },
            {
                $unwind: '$type_info'
            },
            {
                $unwind: '$genre_info'
            },
        ]).toArray();
        res.json(books);
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).json({
            error: 'Failed to fetch books'
        });
    }
});

// Route to get a specific book by ID
app.get('/books/:id', async (req, res) => {
    try {
        const book = await db.collection('books').findOne({
            _id: new ObjectId(req.params.id)
        });
        if (!book) {
            return res.status(404).json({
                error: 'Book not found'
            });
        }
        res.json(book);
    } catch (err) {
        console.error('Error fetching book details:', err);
        res.status(500).json({
            error: 'Failed to fetch book details'
        });
    }
});

// Route to deactivate a book by ID
app.put('/books/:id/deactivate', async (req, res) => {
    try {
        const result = await db.collection('books').updateOne({
            _id: new ObjectId(req.params.id)
        }, {
            $set: {
                is_active: false
            }
        });
        if (result.matchedCount > 0) {
            res.json({
                message: 'Book deactivated successfully'
            });
        } else {
            res.status(404).json({
                error: 'Book not found'
            });
        }
    } catch (err) {
        console.error('Error deactivating book:', err);
        res.status(500).json({
            error: 'Failed to deactivate book'
        });
    }
});

// Route to update a book by ID
app.put('/books/:id', async (req, res) => {
    const {
        title,
        author,
        type_id,
        genre_id,
        publication,
        pages,
        price,
        cover_photo,
    } = req.body;

    try {
        const result = await db.collection('books').updateOne({
            _id: new ObjectId(req.params.id)
        }, {
            $set: {
                title,
                author,
                type_id: new ObjectId(type_id),
                genre_id: new ObjectId(genre_id),
                publication,
                pages,
                price,
                cover_photo,
            },
        });

        if (result.matchedCount > 0) {
            res.json({
                message: 'Book updated successfully'
            });
        } else {
            res.status(404).json({
                error: 'Book not found'
            });
        }
    } catch (err) {
        console.error('Error updating book:', err);
        res.status(500).json({
            error: 'Failed to update book'
        });
    }
});

// Route to add a new book
app.post('/books', async (req, res) => {
    const book = req.body;
    try {
        const result = await db.collection('books').insertOne(book);
        res.status(201).json({
            id: result.insertedId,
            ...book
        });
    } catch (err) {
        console.error('Error adding book:', err);
        res.status(500).json({
            error: 'Failed to add book'
        });
    }
});

// Route to add a new book type
app.post('/book-types', async (req, res) => {
    const {
        type_name
    } = req.body;
    try {
        const result = await db.collection('booktypes').insertOne({
            type_name
        });
        res.status(201).json({
            id: result.insertedId,
            type_name
        });
    } catch (err) {
        console.error('Error adding book type:', err);
        res.status(500).json({
            error: 'Failed to add book type'
        });
    }
});

// Route to add a new genre
app.post('/genres', async (req, res) => {
    const {
        genre_name
    } = req.body;
    try {
        const result = await db.collection('genres').insertOne({
            genre_name
        });
        res.status(201).json({
            id: result.insertedId,
            genre_name
        });
    } catch (err) {
        console.error('Error adding genre:', err);
        res.status(500).json({
            error: 'Failed to add genre'
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
