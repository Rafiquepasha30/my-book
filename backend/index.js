require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 5000; // Use environment variable for port

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL connection using environment variables
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id', connection.threadId);
});

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Book Management API!');
});

// Route to get book types
app.get('/book-types', (req, res) => {
    const query = 'SELECT * FROM booktypes';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching book types:', err);
            res.status(500).json({
                error: 'Failed to fetch book types'
            });
        } else {
            res.json(results);
        }
    });
});

// Route to get genres
app.get('/genres', (req, res) => {
    const query = 'SELECT * FROM genres';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching genres:', err);
            res.status(500).json({
                error: 'Failed to fetch genres'
            });
        } else {
            res.json(results);
        }
    });
});

// Route to get all books
app.get('/books', (req, res) => {
    const query = `
        SELECT books.*, booktypes.type_name, genres.genre_name 
        FROM books 
        JOIN booktypes ON books.type_id = booktypes.id 
        JOIN genres ON books.genre_id = genres.id
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching books:', err);
            res.status(500).json({
                error: 'Failed to fetch books'
            });
        } else {
            res.json(results);
        }
    });
});

// Route to get a specific book by ID
app.get('/books/:id', (req, res) => {
    const bookId = req.params.id;
    const query = `
        SELECT books.*, booktypes.type_name, genres.genre_name 
        FROM books 
        JOIN booktypes ON books.type_id = booktypes.id 
        JOIN genres ON books.genre_id = genres.id
        WHERE books.id = ?
    `;
    connection.query(query, [bookId], (err, results) => {
        if (err) {
            console.error('Error fetching book details:', err);
            res.status(500).json({
                error: 'Failed to fetch book details'
            });
        } else {
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).json({
                    error: 'Book not found'
                });
            }
        }
    });
});

// Route to deactivate a book by ID
app.put('/books/:id/deactivate', (req, res) => {
    const {
        id
    } = req.params;
    const query = 'UPDATE books SET is_active = false WHERE id = ?';

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deactivating book:', err);
            res.status(500).json({
                error: 'Failed to deactivate book'
            });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({
                    message: 'Book deactivated successfully'
                });
            } else {
                res.status(404).json({
                    error: 'Book not found'
                });
            }
        }
    });
});

// Route to update a book by ID
app.put('/books/:id', (req, res) => {
    const {
        id
    } = req.params;
    const {
        title,
        author,
        type_id,
        genre_id,
        publication,
        pages,
        price,
        cover_photo
    } = req.body;
    const query = 'UPDATE books SET title = ?, author = ?, type_id = ?, genre_id = ?, publication = ?, pages = ?, price = ?, cover_photo = ? WHERE id = ?';

    const values = [title, author, type_id, genre_id, publication, pages, price, cover_photo, id];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error updating book:', err);
            res.status(500).json({
                error: 'Failed to update book'
            });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({
                    message: 'Book updated successfully'
                });
            } else {
                res.status(404).json({
                    error: 'Book not found'
                });
            }
        }
    });
});

// Route to add a new book
app.post('/books', (req, res) => {
    const book = req.body;
    const query = 'INSERT INTO books (title, author, type_id, genre_id, publication, pages, price, cover_photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [book.title, book.author, book.type_id, book.genre_id, book.publication, book.pages, book.price, book.cover_photo];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting book:', err);
            res.status(500).json({
                error: 'Failed to add book',
                details: err
            });
        } else {
            res.status(201).json({
                id: results.insertId,
                ...book
            });
        }
    });
});

// Route to add a new book type
app.post('/book-types', (req, res) => {
    const {
        type_name
    } = req.body;
    const query = 'INSERT INTO booktypes (type_name) VALUES (?)';

    connection.query(query, [type_name], (err, results) => {
        if (err) {
            console.error('Error adding book type:', err);
            res.status(500).json({
                error: 'Failed to add book type'
            });
        } else {
            res.status(201).json({
                id: results.insertId,
                type_name
            });
        }
    });
});

// Route to add a new genre
app.post('/genres', (req, res) => {
    const {
        genre_name
    } = req.body;
    const query = 'INSERT INTO genres (genre_name) VALUES (?)';

    connection.query(query, [genre_name], (err, results) => {
        if (err) {
            console.error('Error adding genre:', err);
            res.status(500).json({
                error: 'Failed to add genre'
            });
        } else {
            res.status(201).json({
                id: results.insertId,
                genre_name
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at https://my-book-4.onrender.com:${port}`);
});
