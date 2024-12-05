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
        axios.get('https://my-book-6.onrender.com/books')
            .then(response => setBooks(response.data.filter(book => book.is_active)))
            .catch(error => console.error('Error fetching books:', error));
    };

    const deactivateBook = (id) => {
        console.log('Deactivating book with ID:', id);
        axios.put(`https://my-book-6.onrender.com/books/${id}/deactivate`)
            .then(response => {
                console.log('Book deactivated:', response.data);
                fetchBooks();
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
                        <tr key={book.id}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.type_name}</td>
                            <td>{book.genre_name}</td>
                            <td>{book.publication}</td>
                            <td>{book.pages}</td>
                            <td>{book.price}</td>
                            <td>
                                <Link to={`/books/${book.id}`}>
                                    <img src={book.cover_photo} alt={book.title} width="50" />
                                </Link>
                            </td>
                            <td>
                                <button onClick={() => deactivateBook(book.id)}>Deactivate</button>
                               
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookList;
