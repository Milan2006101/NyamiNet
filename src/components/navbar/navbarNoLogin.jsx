import NavLogo from './NavLogo.jsx';
import { useNavigate } from "react-router-dom";

export default function NavbarNoLogin(){
    const navigate = useNavigate();

    return(
        <div className="navbar">
            <NavLogo />
            <div className="right">
                <input 
                    align="right" 
                    className="search" 
                    type="search" 
                    placeholder="Search" 
                    aria-label="Search"
                />
                <button 
                    onClick={() => navigate("/login")} 
                    className="btn" 
                    type="submit"
                >
                    Bejelentkezés
                </button>
                <button 
                    onClick={() => navigate("/register")} 
                    className="btn" 
                    type="submit"
                >
                    Regisztráció
                </button>
            </div>
        </div>
    );
}



