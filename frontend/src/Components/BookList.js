import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookList.css';
import { Link } from 'react-router-dom';

const BookList = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = () => {
        axios.get('https://my-book-8.onrender.com/books')
            .then(response => {
                const activeBooks = response.data.filter(book => book.is_active !== false); // Filter active books
                setBooks(activeBooks);
            })
            .catch(error => console.error('Error fetching books:', error));
    };

    const deactivateBook = (id) => {
        console.log('Deactivating book with ID:', id);
        axios.put(`https://my-book-8.onrender.com/books/${id}/deactivate`)
            .then(() => {
                console.log('Book deactivated successfully');
                fetchBooks(); // Refresh the book list after deactivating
            })
            .catch(error => console.error('Error deactivating book:', error));
    };

    return (
        <div className="book-list-container">
            <h1>Book List</h1>
            <table className="book-list-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Type</th>
                        <th>Genre</th>
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
                            <td>{book.type_id?.type_name || 'N/A'}</td>
                            <td>{book.genre_id?.genre_name || 'N/A'}</td>
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
        </div>
    );
};

export default BookList;
