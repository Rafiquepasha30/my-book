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
        cover_photo: '',
    });
    const [bookTypes, setBookTypes] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch book types
        axios.get('https://my-book-6.onrender.com/book-types')
            .then(response => {
                setBookTypes(response.data);
            })
            .catch(error => console.error('Error fetching book types:', error));

        // Fetch genres
        axios.get('https://my-book-6.onrender.com/genres')
            .then(response => {
                setGenres(response.data);
            })
            .catch(error => console.error('Error fetching genres:', error));

        // Fetch book details if editing
        if (id) {
            axios.get(`https://my-book-6.onrender.com/books/${id}`)
                .then(response => {
                    const fetchedBook = response.data;
                    setBook({
                        ...fetchedBook,
                        type_id: fetchedBook.type_id || '',
                        genre_id: fetchedBook.genre_id || '',
                    });
                })
                .catch(error => console.error('Error fetching book details:', error));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook({ ...book, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const action = id ? axios.put : axios.post;
        const url = id ? `https://my-book-6.onrender.com/books/${id}` : 'https://my-book-6.onrender.com/books';

        try {
            const bookData = {
                ...book,
                type_id: book.type_id,
                genre_id: book.genre_id,
            };

            await action(url, bookData);
            navigate('/');
        } catch (error) {
            console.error('Error saving book:', error.response?.data || error.message);
            alert('Failed to save book. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="book-form-container">
            <h1>{id ? 'Edit' : 'Add'} Book</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={book.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Author</label>
                    <input
                        type="text"
                        name="author"
                        value={book.author}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Type</label>
                    <select
                        name="type_id"
                        value={book.type_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Type</option>
                        {bookTypes.map((type) => (
                            <option key={type._id} value={type._id}>
                                {type.type_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Genre</label>
                    <select
                        name="genre_id"
                        value={book.genre_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Genre</option>
                        {genres.map((genre) => (
                            <option key={genre._id} value={genre._id}>
                                {genre.genre_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Publication</label>
                    <input
                        type="text"
                        name="publication"
                        value={book.publication}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Pages</label>
                    <input
                        type="number"
                        name="pages"
                        value={book.pages}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={book.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Cover Photo URL</label>
                    <input
                        type="text"
                        name="cover_photo"
                        value={book.cover_photo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : id ? 'Update' : 'Add'} Book
                </button>
            </form>
        </div>
    );
};

export default BookForm;
