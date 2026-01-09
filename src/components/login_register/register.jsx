import NavbarBack from "../navbar/navbarBack.jsx";
import Footer from "../navbar/footer.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');

    async function handleRegister(){
        setError('');
        if (password !== password2){ setError('A jelszavak nem egyeznek'); return; }
        try{
            const res = await fetch('http://localhost:3000/register', {
                method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, email, password })
            });
            if (!res.ok){ const body = await res.json().catch(()=>({})); setError(body.error || 'Regisztráció hiba'); return; }
            navigate('/login');
        }catch(e){ setError('Hálózati hiba'); }
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
                        <h1>Regisztráció</h1>
                    </td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <div className="box">


                        <h3 className="subtitle">Név:</h3>
                        <input value={name} onChange={e=>setName(e.target.value)} type="text" className="inputfield"></input>

                        <h3 className="subtitle">Email:</h3>
                        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="inputfield"></input>

                        <h3 className="subtitle">Jelszó:</h3>
                        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="inputfield"></input>

                        <h3 className="subtitle">Jelszó megerősítése:</h3>
                        <input value={password2} onChange={e=>setPassword2(e.target.value)} type="password" className="inputfield"></input>

                        {error && <div className="link">{error}</div>}

                        <br/>

                        <button onClick={handleRegister} className="button">Regisztráció</button>
                        
                        <Link to="/login" className="link">
                            Bejelentkezés
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