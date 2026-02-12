import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../../utils/auth";
import './styles/navbar.css';

export default function NavbarUserActions({ selected }) {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    
    const handleProfileClick = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.role === 'admin') navigate('/profile_admin');
            else navigate('/profile');
        } catch(e) { 
            navigate('/profile'); 
        }
    };

    const handleLogout = () => {
        removeToken();
        navigate('/');
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        if (value.trim()) {
            navigate(`/mainlogin?search=${encodeURIComponent(value)}`);
        } else {
            navigate('/mainlogin');
        }
    };
    
    return (
        <div className="right">
            <input 
                className="search" 
                type="search" 
                placeholder="Keresés..." 
                aria-label="Search"
                value={searchText}
                onChange={handleSearchChange}
            />
            <button 
                onClick={handleProfileClick} 
                className={`btn ${selected === "fiok" ? "selected" : ""}`} 
                type="submit"
            >
                A Fiókom
            </button>
            <button 
                onClick={handleLogout} 
                className="btn" 
                type="submit"
            >
                Kijelentkezés
            </button>
        </div>
    );
}
