import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles/navbar.css';

export default function NavbarAuthButtons({ onNavigate }) {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        if (value.trim()) {
            navigate(`/?search=${encodeURIComponent(value)}`);
        } else {
            navigate('/');
        }
    };

    const handleNav = (path) => {
        navigate(path);
        if (onNavigate) onNavigate();
    };
    
    return (
        <div className="right">
            <input 
                align="right" 
                className="search" 
                type="search" 
                placeholder="Keresés..." 
                aria-label="Search"
                value={searchText}
                onChange={handleSearchChange}
            />
            <button onClick={() => handleNav("/login")} className="btn" type="submit">
                Bejelentkezés
            </button>
            <button onClick={() => handleNav("/register")} className="btn" type="submit">
                Regisztráció
            </button>
        </div>
    );
}
