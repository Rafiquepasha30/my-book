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
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDropdownData();
        if (id) fetchBookDetails();
    }, [id]);

    // Fetch book types and genres
    const fetchDropdownData = async () => {
        try {
            const [typesResponse, genresResponse] = await Promise.all([
                axios.get('https://my-book-8.onrender.com/book-types'),
                axios.get('https://my-book-8.onrender.com/genres'),
            ]);
            setBookTypes(typesResponse.data);
            setGenres(genresResponse.data);
        } catch (err) {
            console.error('Error fetching dropdown data:', err);
            setError('Failed to load dropdown data. Please try again.');
        }
    };

    // Fetch book details if editing
    const fetchBookDetails = async () => {
        try {
            const response = await axios.get(`https://my-book-8.onrender.com/books/${id}`);
            const fetchedBook = response.data;
            setBook({
                ...fetchedBook,
                type_id: fetchedBook.type_id || '',
                genre_id: fetchedBook.genre_id || '',
            });
        } catch (err) {
            console.error('Error fetching book details:', err);
            setError('Failed to load book details. Please try again.');
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook({ ...book, [name]: value });
    };

    // Validate form data
    const validateForm = () => {
        if (!book.title || !book.author || !book.type_id || !book.genre_id || !book.pages || !book.price || !book.cover_photo) {
            setError('All fields are required except publication.');
            return false;
        }
        if (book.pages <= 0 || book.price <= 0) {
            setError('Pages and price must be positive numbers.');
            return false;
        }
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateForm()) return;

        setLoading(true);
        const action = id ? axios.put : axios.post;
        const url = id ? `https://my-book-8.onrender.com/books/${id}` : 'https://my-book-8.onrender.com/books';

        try {
            const bookData = {
                ...book,
                type_id: book.type_id,
                genre_id: book.genre_id,
            };

            console.log('Submitting Book Data:', bookData); // Debugging
            await action(url, bookData);
            navigate('/');
        } catch (err) {
            console.error('Error saving book:', err.response?.data || err.message);
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
