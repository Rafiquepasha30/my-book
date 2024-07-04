import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList from './Components/BookList';
import BookDetail from './Components/BookDetail';
import BookForm from './Components/BookForm';
import Header from './Components/Header';

const App = () => (
    <Router>
        <Header />
        <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/add" element={<BookForm />} />
             <Route path="/books/edit/:id" element={<BookForm />} />
        </Routes>
    </Router>
);

export default App;
