import reactLogo from '../../assets/logogo.png';
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";
import './styles/navbar.css';

export default function NavbarLogo() {
    const navigate = useNavigate();

    const handleClick = () => {
        if (isAuthenticated()) {
            navigate("/mainlogin");
        } else {
            navigate("/");
        }
    };
    
    return (
        <>
            <img src={reactLogo} alt="Logo" />
            <a className="nyami feher" onClick={handleClick} style={{cursor: 'pointer'}}>
                NyamiNet
            </a>
        </>
    );
}
