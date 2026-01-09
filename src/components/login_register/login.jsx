import NavbarBack from "../navbar/navbarBack.jsx";
import Footer from "../navbar/footer.jsx";
import { Link, useNavigate  } from "react-router-dom";
import { useState } from "react";

export default function Login(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    function handleLogin(){
        // Bypass backend, just redirect to mainlogin
        localStorage.setItem('user', JSON.stringify({ email }));
        navigate('/mainlogin');
    }

    return(
        <>
        <header>
            <NavbarBack/>
        </header>
        <main className="center">
            <table className="loginpage">
                <thead>
                <tr>
                    <td className="center title">
                        <h1>Bejelentkezés</h1>
                    </td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <div className="box">
                        <h3 className="subtitle">Email:</h3>
                        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="inputfield"></input>
                        <h3 className="subtitle">Jelszó:</h3>
                        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="inputfield"></input>
                        <br/>
                        {error && <div className="link">{error}</div>}
                        <button onClick={handleLogin} className="button">Bejelentkezés</button>

                        <Link to="/register" className="link" style={{display:'block',marginTop:12}}>
                            Regisztráció
                        </Link>

                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </main>
        <footer className="footer">
            <Footer />
        </footer>
        </>
    )
}