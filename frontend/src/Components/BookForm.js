import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './BookForm.css';

const BookForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState({
        title: '',
        author: '',
        genre: '',
        type: '',
        publication: '',
        pages: '',
        price: '',
        cover_photo: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) fetchBookDetails();
    }, [id]);

    const fetchBookDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/books/${id}`);
            setBook(response.data);
        } catch (err) {
            setError('Failed to load book details. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook({ ...book, [name]: value });
    };

    const validateForm = () => {
        if (!book.title || !book.author || !book.genre || !book.type || !book.pages || !book.price || !book.cover_photo) {
            setError('All fields except publication are required.');
            return false;
        }
        if (book.pages <= 0 || book.price <= 0) {
            setError('Pages and price must be positive numbers.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateForm()) return;

        setLoading(true);
        const action = id ? axios.put : axios.post;
        const url = id ? `http://localhost:5000/books/${id}` : 'http://localhost:5000/books';

        try {
            await action(url, book);
            navigate('/');
        } catch (err) {
            setError('Failed to save book. Please check your inputs and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="book-form-container">
            <h1>{id ? 'Edit' : 'Add'} Book</h1>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div><label>Title</label><input type="text" name="title" value={book.title} onChange={handleChange} required /></div>
                <div><label>Author</label><input type="text" name="author" value={book.author} onChange={handleChange} required /></div>
                <div>
                    <label>Genre</label>
                    <select name="genre" value={book.genre} onChange={handleChange} required>
                        <option value="">Select Genre</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Non-fiction">Non-fiction</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Sci-Fi">Sci-Fi</option>
                    </select>
                </div>
                <div>
                    <label>Type</label>
                    <select name="type" value={book.type} onChange={handleChange} required>
                        <option value="">Select Type</option>
                        <option value="Hardcover">Hardcover</option>
                        <option value="Paperback">Paperback</option>
                        <option value="Ebook">Ebook</option>
                    </select>
                </div>
                <div><label>Publication</label><input type="text" name="publication" value={book.publication} onChange={handleChange} /></div>
                <div><label>Pages</label><input type="number" name="pages" value={book.pages} onChange={handleChange} required /></div>
                <div><label>Price</label><input type="number" name="price" value={book.price} onChange={handleChange} required /></div>
                <div><label>Cover Photo URL</label><input type="text" name="cover_photo" value={book.cover_photo} onChange={handleChange} required /></div>
                <button type="submit" disabled={loading}>{loading ? 'Saving...' : id ? 'Update' : 'Add'} Book</button>
            </form>
        </div>
    );
};

export default BookForm;