import React from 'react';
import './Header.css'
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header  className="header">
            <h1>My Library</h1>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/add">Add Book</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
