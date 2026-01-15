import reactLogo from '../../assets/logogo.png';
import { useNavigate } from "react-router-dom";

export default function NavLogo(){
    const navigate = useNavigate();

    return (
        <>
            <img src={reactLogo} alt="NyamiNet Logo" />
            <a className="nyami feher" onClick={() => navigate("/")}>NyamiNet</a>
        </>
    );
}
