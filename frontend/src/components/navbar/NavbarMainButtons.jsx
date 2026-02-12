import { useNavigate } from "react-router-dom";
import './styles/navbar.css';

export default function NavbarMainButtons({ selected }) {
    const navigate = useNavigate();
    
    return (
        <div className='left'>
            <button 
                onClick={() => navigate("/mainlogin")} 
                className={`btn ${selected === "fooldal" ? "selected" : ""}`} 
                type="submit"
            >
                Főoldal
            </button>
            <button 
                onClick={() => navigate("/saved")} 
                className={`btn ${selected === "mentett" ? "selected" : ""}`} 
                type="submit"
            >
                Mentett Receptek
            </button>
            <button 
                onClick={() => navigate("/upload")} 
                className={`btn ${selected === "feltoltes" ? "selected" : ""}`} 
                type="submit"
            >
                Recept Feltöltés
            </button>
        </div>
    );
}
