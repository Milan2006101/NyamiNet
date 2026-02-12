import { Link, useNavigate  } from "react-router-dom";
import { useState } from "react";
import './styles/auth.css';

const API_BASE_URL = 'http://localhost:3001';

export default function Login(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(){
        setError('');
        setLoading(true);
        
        try {
            const res = await fetch(`${API_BASE_URL}/auth/bejelentkezes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, jelszo: password })
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                setError(data.uzenet || 'Bejelentkezési hiba');
                setLoading(false);
                return;
            }
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            if (data.user.sotet_mod === 1) {
                localStorage.setItem('darkMode', 'true');
                document.documentElement.classList.add('dark-mode');
            } else {
                localStorage.setItem('darkMode', 'false');
                document.documentElement.classList.remove('dark-mode');
            }
            
            navigate('/mainlogin');
        } catch (e) {
            setError('Hálózati hiba');
            setLoading(false);
        }
    }

    return(
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
                        {error && <div className="link" style={{color: 'red'}}>{error}</div>}
                        <button onClick={handleLogin} className="button" disabled={loading}>
                            {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
                        </button>

                        <Link to="/register" className="link" style={{display:'block',marginTop:12}}>
                            Regisztráció
                        </Link>

                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </main>
    )
}