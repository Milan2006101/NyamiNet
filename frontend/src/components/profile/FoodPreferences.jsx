import { useState, useEffect } from "react";
import { getAuthHeaders, isAuthenticated } from "../../utils/auth";
import './styles/profile.css';
import './styles/preference-buttons.css';
import './styles/preference-colors.css';

const API_BASE_URL = 'http://localhost:3001';

export default function FoodPreferences() {
    const [userPreferences, setUserPreferences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated()) {
            fetchPreferences();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchPreferences = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/felhasznalo/preferenciak`, {
                headers: getAuthHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                setUserPreferences(data.map(p => p.preferencia_nev));
            }
        } catch (error) {
            console.error('Error fetching preferences:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePreferenceClick = async (preferenciaNev) => {
        if (!isAuthenticated()) {
            alert('Jelentkezz be a preferenciák kezeléséhez!');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/felhasznalo/preferenciak`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ preferencia_nev: preferenciaNev })
            });

            if (response.ok) {
                await fetchPreferences();
            } else {
                console.error('Failed to toggle preference');
            }
        } catch (error) {
            console.error('Error toggling preference:', error);
        }
    };

    const isActive = (prefName) => userPreferences.includes(prefName);

    return (
        <div className="box profilebox">
            <h1>Ételpreferenciák:</h1>
            
            <div>
                <button 
                    type="button"
                    className="preferenceButton veg" 
                    onClick={() => handlePreferenceClick('vegán')}
                    style={{ cursor: 'pointer', opacity: isActive('vegán') ? 1 : 0.3 }}
                >
                    Vegán
                </button>
                <button 
                    type="button"
                    className="preferenceButton veg" 
                    onClick={() => handlePreferenceClick('vegetáriánus')}
                    style={{ cursor: 'pointer', opacity: isActive('vegetáriánus') ? 1 : 0.3 }}
                >
                    Vegetáriánus
                </button>
                <button 
                    type="button"
                    className="preferenceButton nut"
                    onClick={() => handlePreferenceClick('mogyorók')}
                    style={{ cursor: 'pointer', opacity: isActive('mogyorók') ? 1 : 0.3 }}
                >
                    Mogyorók
                </button>
            </div>

            <div>
                <button 
                    type="button"
                    className="preferenceButton lactose" 
                    onClick={() => handlePreferenceClick('laktózmentes')}
                    style={{ cursor: 'pointer', opacity: isActive('laktózmentes') ? 1 : 0.3 }}
                >
                    Laktóz
                </button>
                <button 
                    type="button"
                    className="preferenceButton gluten" 
                    onClick={() => handlePreferenceClick('gluténmentes')}
                    style={{ cursor: 'pointer', opacity: isActive('gluténmentes') ? 1 : 0.3 }}
                >
                    Glutén
                </button>
                <button 
                    type="button"
                    className="preferenceButton sugar"
                    onClick={() => handlePreferenceClick('cukor')}
                    style={{ cursor: 'pointer', opacity: isActive('cukor') ? 1 : 0.3 }}
                >
                    Cukor
                </button>
            </div>

            <div>
                <button 
                    type="button" 
                    className="preferenceButton fish" 
                    onClick={() => handlePreferenceClick('hal')}
                    style={{ cursor: 'pointer', opacity: isActive('hal') ? 1 : 0.3 }}
                >
                    Hal
                </button>
                <button 
                    type="button" 
                    className="preferenceButton soy" 
                    onClick={() => handlePreferenceClick('szója')}
                    style={{ cursor: 'pointer', opacity: isActive('szója') ? 1 : 0.3 }}
                >
                    Szója
                </button>
                <button 
                    type="button" 
                    className="preferenceButton egg" 
                    onClick={() => handlePreferenceClick('tojás')}
                    style={{ cursor: 'pointer', opacity: isActive('tojás') ? 1 : 0.3 }}
                >
                    Tojás
                </button>
            </div>

            <div>
                <button type="button" className="preferenceButton fish invisible">Hal</button>
                <button 
                    type="button" 
                    className="preferenceButton wheat" 
                    onClick={() => handlePreferenceClick('búza')}
                    style={{ cursor: 'pointer', opacity: isActive('búza') ? 1 : 0.3 }}
                >
                    Búza
                </button>
                <button type="button" className="preferenceButton egg invisible">Tojás</button>
            </div>
        </div>
    );
}
