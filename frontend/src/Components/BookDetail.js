import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookDetail.css';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        axios.get(`https://my-book-6.onrender.com/books/${id}`)
            .then(response => setBook(response.data))
            .catch(error => console.error('Error fetching book details:', error));
    }, [id]);

    if (!book) return <p className="loading-text">Loading...</p>;

    return (
        <div className="book-detail-container">
            <h1>{book.title}</h1>
            <img src={book.cover_photo} alt={book.title} width="200" />
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Type:</strong> {book.type_name}</p>
            <p><strong>Genre:</strong> {book.genre_name}</p>
            <p><strong>Publication:</strong> {book.publication}</p>
            <p><strong>Pages:</strong> {book.pages}</p>
            <p><strong>Price:</strong> ${book.price}</p>
            <button className='edit-button'> 
                <Link to={`/books/edit/${book.id}`} className="edit-link">Edit Details</Link> 
                </button>
        </div>
    );
};

export default BookDetail;
