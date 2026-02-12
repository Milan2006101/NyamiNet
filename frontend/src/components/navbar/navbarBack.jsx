import NavbarLogo from './NavbarLogo';
import { useNavigate } from "react-router-dom";
import './styles/navbar.css';

export default function NavbarBack(){
    const navigate = useNavigate();
    return(
        <div className="navbar">
            <NavbarLogo />
            <div className="right">
                <button onClick={() => navigate("/")} className="btn btn-large" type="submit">Vissza</button>
            </div>
        </div>
    )
}

