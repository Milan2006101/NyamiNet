import { useState } from 'react';
import NavbarLogo from './NavbarLogo';
import NavbarMainButtons from './NavbarMainButtons';
import NavbarUserActions from './NavbarUserActions';
import './styles/navbar.css';

export default function NavbarLogin({selected}){
    const [menuOpen, setMenuOpen] = useState(false);

    return(
        <div className="navbar">
            <NavbarLogo />
            <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
                <span className="hamburger-icon">&#9776;</span>
            </button>
            <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                <NavbarMainButtons selected={selected} onNavigate={() => setMenuOpen(false)} />
                <NavbarUserActions selected={selected} onNavigate={() => setMenuOpen(false)} />
            </div>
        </div>
    )
}