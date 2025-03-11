import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookDetail.css';
import { useParams, Link } from 'react-router-dom';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        // Fetch book details by ID
        axios.get(`https://my-book-15.onrender.com/${id}`)
            .then(response => setBook(response.data))
            .catch(error => console.error('Error fetching book details:', error));
    }, [id]);

    if (!book) return <p className="loading-text">Loading...</p>;

    return (
        <div className="book-detail-container">
            <h1>{book.title}</h1>
            <img src={book.cover_photo} alt={book.title} width="200" />
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Publication:</strong> {book.publication || 'N/A'}</p>
            <p><strong>Pages:</strong> {book.pages || 'N/A'}</p>
            <p><strong>Price:</strong> ${book.price || 'N/A'}</p>
            <Link to={`/books/edit/${book._id}`} className="edit-link">
                <button className="edit-button">Edit Details</button>
            </Link>
        </div>
    );
};

export default BookDetail;
