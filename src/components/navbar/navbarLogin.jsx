import reactLogo from '../../assets/logogo.png'
import { useNavigate } from "react-router-dom";

export default function NavbarLogin({selected}){

const navigate = useNavigate();

if(selected == "fooldal")
{
return(
    <>
        <div className="navbar">
            <img src={reactLogo} />
            <a className="nyami feher" onClick={() => navigate("/")}>NyamiNet</a>
            <div className='left'>
            <button onClick={() => navigate("/mainlogin")} className="btn selected" type="submit">Főoldal</button>
            <button onClick={() => navigate("/saved")} className="btn" type="submit">Mentett Receptek</button>
            <button onClick={() => navigate("/upload")} className="btn" type="submit">Recept Feltöltés</button>
            </div>
            <div className="right">
            <input className="search" type="search" placeholder="Search" aria-label="Search"/>
            <button onClick={() => {
                try{
                    const user = JSON.parse(localStorage.getItem('user'));
                    if (user && user.role === 'admin') navigate('/profile_admin');
                    else navigate('/profile');
                }catch(e){ navigate('/profile'); }
            }} className="btn" type="submit">A Fiókom</button>
            <button onClick={() => { localStorage.removeItem('user'); navigate('/'); }} className="btn" type="submit">Kijelentkezés</button>
            </div>
    </div>
    </>
)
}

if(selected == "mentett")
{
return(
    <>
    <div className="navbar">
            <img src={reactLogo} />
            <a className="nyami feher">NyamiNet</a>
            <div className='left'>
            <button onClick={() => navigate("/mainlogin")} className="btn" type="submit">Főoldal</button>
            <button onClick={() => navigate("/saved")} className="btn selected" type="submit">Mentett Receptek</button>
            <button onClick={() => navigate("/upload")} className="btn" type="submit">Recept Feltöltés</button>
            </div>
            <div className="right">
            <input className="search" type="search" placeholder="Search" aria-label="Search"/>
            <button onClick={() => {
                    try{
                        const user = JSON.parse(localStorage.getItem('user'));
                        if (user && user.role === 'admin') navigate('/profile_admin');
                        else navigate('/profile');
                    }catch(e){ navigate('/profile'); }
                }} className="btn" type="submit">A Fiókom</button>
            <button onClick={() => { localStorage.removeItem('user'); navigate('/'); }} className="btn" type="submit">Kijelentkezés</button>
            </div>
    </div>
    </>
)
}

if(selected == "feltoltes")
{
return(
    <>
    <div className="navbar">
            <img src={reactLogo} />
            <a className="nyami feher">NyamiNet</a>
            <div className='left'>
            <button onClick={() => navigate("/mainlogin")} className="btn" type="submit">Főoldal</button>
            <button onClick={() => navigate("/saved")} className="btn" type="submit">Mentett Receptek</button>
            <button onClick={() => navigate("/upload")} className="btn selected" type="submit">Recept Feltöltés</button>
            </div>
            <div className="right">
            <input className="search" type="search" placeholder="Search" aria-label="Search"/>
            <button onClick={() => navigate("/profile")} className="btn" type="submit">A Fiókom</button>
            <button onClick={() => navigate("/")} className="btn" type="submit">Kijelentkezés</button>
            </div>
    </div>
    </>
)
}

if(selected == "fiok")
{
return(
    <>
    <div className="navbar">
            <img src={reactLogo} />
            <a className="nyami feher">NyamiNet</a>
            <div className='left'>
            <button onClick={() => navigate("/mainlogin")} className="btn" type="submit">Főoldal</button>
            <button onClick={() => navigate("/saved")} className="btn" type="submit">Mentett Receptek</button>
            <button onClick={() => navigate("/upload")} className="btn" type="submit">Recept Feltöltés</button>
            </div>
            <div className="right">
            <input className="search" type="search" placeholder="Search" aria-label="Search"/>
            <button onClick={() => navigate("/profile")} className="btn selected" type="submit">A Fiókom</button>
            <button onClick={() => navigate("/")} className="btn" type="submit">Kijelentkezés</button>
            </div>
    </div>
    </>
)
}


return(
    <>
    <div className="navbar">
            <img src={reactLogo} />
            <a className="nyami feher">NyamiNet</a>
            <div className='left'>
            <button onClick={() => navigate("/mainlogin")} className="btn" type="submit">Főoldal</button>
            <button onClick={() => navigate("/saved")} className="btn" type="submit">Mentett Receptek</button>
            <button onClick={() => navigate("/upload")} className="btn" type="submit">Recept Feltöltés</button>
            </div>
            <div className="right">
            <input className="search" type="search" placeholder="Search" aria-label="Search"/>
            <button onClick={() => {
                    try{
                        const user = JSON.parse(localStorage.getItem('user'));
                        if (user && user.role === 'admin') navigate('/profile_admin');
                        else navigate('/profile');
                    }catch(e){ navigate('/profile'); }
                }} className="btn" type="submit">A Fiókom</button>
            <button onClick={() => { localStorage.removeItem('user'); navigate('/'); }} className="btn" type="submit">Kijelentkezés</button>
            </div>
    </div>
    </>
)

}