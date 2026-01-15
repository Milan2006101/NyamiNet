import { useNavigate } from "react-router-dom";

export default function UserButtons({ selected }){
    const navigate = useNavigate();

    const handleProfileClick = () => {
        try{
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.role === 'admin') navigate('/profile_admin');
            else navigate('/profile');
        }catch(e){ 
            navigate('/profile'); 
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="right">
            <input 
                className="search" 
                type="search" 
                placeholder="Search" 
                aria-label="Search"
            />
            <button 
                onClick={handleProfileClick} 
                className={`btn ${selected === "fiok" ? "selected" : ""}`} 
                type="submit"
            >
                A Fiókom
            </button>
            <button 
                onClick={handleLogout} 
                className="btn" 
                type="submit"
            >
                Kijelentkezés
            </button>
        </div>
    );
}
