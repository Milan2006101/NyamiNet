import { useNavigate } from "react-router-dom";
import './styles/navbar.css';

export default function NavbarMainButtons({ selected, onNavigate }) {
    const navigate = useNavigate();

    const handleNav = (path) => {
        navigate(path);
        if (onNavigate) onNavigate();
    };
    
    return (
        <div className='left'>
            <button 
                onClick={() => handleNav("/mainlogin")} 
                className={`btn ${selected === "fooldal" ? "selected" : ""}`} 
                type="submit"
            >
                Főoldal
            </button>
            <button 
                onClick={() => handleNav("/saved")} 
                className={`btn ${selected === "mentett" ? "selected" : ""}`} 
                type="submit"
            >
                Mentett Receptek
            </button>
            <button 
                onClick={() => handleNav("/upload")} 
                className={`btn ${selected === "feltoltes" ? "selected" : ""}`} 
                type="submit"
            >
                Recept Feltöltés
            </button>
        </div>
    );
}
