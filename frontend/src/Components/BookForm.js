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
        type_id: '',
        genre_id: '',
        publication: '',
        pages: '',
        price: '',
        cover_photo: ''
    });
    const [bookTypes, setBookTypes] = useState([]);
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/book-types')
            .then(response => setBookTypes(response.data))
            .catch(error => console.error('Error fetching book types:', error));

        axios.get('http://localhost:5000/genres')
            .then(response => setGenres(response.data))
            .catch(error => console.error('Error fetching genres:', error));

        if (id) {
            axios.get(`http://localhost:5000/books/${id}`)
                .then(response => setBook(response.data))
                .catch(error => console.error('Error fetching book details:', error));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook({ ...book, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const action = id ? axios.put : axios.post;
        const url = id ? `http://localhost:5000/books/${id}` : 'http://localhost:5000/books';

        action(url, book)
            .then(() => navigate('/'))
            .catch(error => console.error('Error saving book:', error));
    };

    return (
        <div className="book-form-container">
            <h1>{id ? 'Edit' : 'Add'} Book</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input type="text" name="title" value={book.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>Author</label>
                    <input type="text" name="author" value={book.author} onChange={handleChange} required />
                </div>
                <div>
                    <label>Type</label>
                    <select name="type_id" value={book.type_id} onChange={handleChange} required>
                        <option value="">Select Type</option>
                        {bookTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.type_name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Genre</label>
                    <select name="genre_id" value={book.genre_id} onChange={handleChange} required>
                        <option value="">Select Genre</option>
                        {genres.map(genre => (
                            <option key={genre.id} value={genre.id}>{genre.genre_name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Publication</label>
                    <input type="text" name="publication" value={book.publication} onChange={handleChange} />
                </div>
                <div>
                    <label>Pages</label>
                    <input type="number" name="pages" value={book.pages} onChange={handleChange} required />
                </div>
                <div>
                    <label>Price</label>
                    <input type="number" name="price" value={book.price} onChange={handleChange} required />
                </div>
                <div>
                    <label>Cover Photo URL</label>
                    <input type="text" name="cover_photo" value={book.cover_photo} onChange={handleChange} required />
                </div>
                <button type="submit">{id ? 'Update' : 'Add'} Book</button>
            </form>
        </div>
    );
};

export default BookForm;
