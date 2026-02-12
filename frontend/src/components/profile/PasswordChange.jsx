import { useState } from 'react';
import { getUser } from '../../utils/auth';
import './styles/profile.css';

const API_BASE_URL = 'http://localhost:3001';

export default function PasswordChange() {
    const [regiJelszo, setRegiJelszo] = useState('');
    const [ujJelszo, setUjJelszo] = useState('');
    const [ujJelszoMegerosites, setUjJelszoMegerosites] = useState('');
    const [loading, setLoading] = useState(false);
    const user = getUser();

    const handleSubmit = async () => {
        // Validation
        if (!regiJelszo || !ujJelszo || !ujJelszoMegerosites) {
            alert('Kérlek töltsd ki az összes mezőt!');
            return;
        }

        if (ujJelszo !== ujJelszoMegerosites) {
            alert('Az új jelszavak nem egyeznek!');
            return;
        }

        if (ujJelszo.length < 6) {
            alert('Az új jelszó legalább 6 karakter hosszú legyen!');
            return;
        }

        if (!user || !user.felhasznalo_id) {
            alert('Nincs bejelentkezve!');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/jelszo-valtoztatas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    felhasznalo_id: user.felhasznalo_id,
                    regi_jelszo: regiJelszo,
                    uj_jelszo: ujJelszo
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Jelszó sikeresen megváltoztatva!');
                // Clear form
                setRegiJelszo('');
                setUjJelszo('');
                setUjJelszoMegerosites('');
            } else {
                alert(data.uzenet || 'Hiba történt a jelszó módosítása során');
            }
        } catch (error) {
            console.error('Password change error:', error);
            alert('Hiba történt a jelszó módosítása során');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="box profilebox">
            <h1 className="profileTitle">Jelszó megváltoztatása:</h1>
            Régi jelszó:
            <input 
                type="password" 
                className="sideSelect profileInput"
                value={regiJelszo}
                onChange={(e) => setRegiJelszo(e.target.value)}
                disabled={loading}
            />
            Új jelszó:
            <input 
                type="password" 
                className="sideSelect profileInput"
                value={ujJelszo}
                onChange={(e) => setUjJelszo(e.target.value)}
                disabled={loading}
            />
            Új jelszó megerősítése:
            <input 
                type="password" 
                className="sideSelect profileInput"
                value={ujJelszoMegerosites}
                onChange={(e) => setUjJelszoMegerosites(e.target.value)}
                disabled={loading}
            />
            <button 
                className="button profileInput"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? 'Mentés...' : 'Mentés'}
            </button>
        </div>
    );
}
