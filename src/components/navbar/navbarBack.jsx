import NavLogo from './NavLogo.jsx';
import { useNavigate } from "react-router-dom";

export default function NavbarBack(){
    const navigate = useNavigate();

    return(
        <div className="navbar">
            <NavLogo />
            <div className="right">
                <button 
                    onClick={() => navigate("/")} 
                    className="btn btn-large" 
                    type="submit"
                >
                    Vissza
                </button>
            </div>
        </div>
    );
}

