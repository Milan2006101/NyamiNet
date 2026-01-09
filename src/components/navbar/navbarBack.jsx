import reactLogo from '../../assets/logogo.png'
import { useNavigate } from "react-router-dom";



export default function NavbarBack(){
    const navigate = useNavigate();
return(
    <>
    <div className="navbar">
            <img src={reactLogo} />
            <a className="nyami feher" onClick={() => navigate("/")}>NyamiNet</a>
            <div className="right">
            <button onClick={() => navigate("/")} className="btn btn-large" type="submit">Vissza</button>
            </div>
    </div>
    </>
)
}

