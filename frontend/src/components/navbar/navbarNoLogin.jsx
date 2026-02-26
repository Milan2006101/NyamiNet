import { useState } from 'react';
import NavbarLogo from './NavbarLogo';
import NavbarAuthButtons from './NavbarAuthButtons';
import './styles/navbar.css';

export default function NavbarNoLogin(){
    const [menuOpen, setMenuOpen] = useState(false);

    return(
        <div className="navbar">
            <NavbarLogo />
            <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
                <span className="hamburger-icon">&#9776;</span>
            </button>
            <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                <NavbarAuthButtons onNavigate={() => setMenuOpen(false)} />
            </div>
        </div>
    )
}



