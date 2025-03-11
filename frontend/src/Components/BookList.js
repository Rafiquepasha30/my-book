import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BookList.css';

const BookList = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = () => {
        axios.get('https://my-book-14.onrender.com')
            .then(response => {
                const activeBooks = response.data;
                console.log('Active books:', activeBooks); // Log active books for debugging
                setBooks(activeBooks);
            })
            .catch(error => {
                console.error('Error fetching books:', error);
                alert('Failed to fetch books');
            });
    };

    const deactivateBook = (id) => {
        console.log('Deactivating book with ID:', id);
        axios.put(`https://my-book-14.onrender.com/${id}/deactivate`)
            .then((response) => {
                console.log('Book deactivated successfully:', response.data);
                fetchBooks(); // Refresh the book list after deactivating
            })
            .catch(error => {
                console.error('Error deactivating book:', error);
                alert('Failed to deactivate book');
            });
    };

    return (
        <div className="book-list-container">
            <h1>Book List</h1>
            {books.length === 0 ? (
                <p>No active books available.</p>
            ) : (
                <table className="book-list-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Type</th>
                            <th>Publication</th>
                            <th>Pages</th>
                            <th>Price</th>
                            <th>Cover</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book._id}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.type}</td>
                                <td>{book.publication || 'N/A'}</td>
                                <td>{book.pages || 'N/A'}</td>
                                <td>{book.price || 'N/A'}</td>
                                <td>
                                    <Link to={`/books/${book._id}`}>
                                        <img src={book.cover_photo} alt={book.title} width="50" />
                                    </Link>
                                </td>
                                <td>
                                    <button onClick={() => deactivateBook(book._id)}>Deactivate</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BookList;
