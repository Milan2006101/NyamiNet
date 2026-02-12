import { useState, useEffect } from "react";
import { getUser, isAuthenticated } from "../../utils/auth";
import './styles/profile.css';

const API_BASE_URL = 'http://localhost:3001';

export default function ThemeSelector() {
    const [darkMode, setDarkMode] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated()) {
            setLoading(false);
            return;
        }
        
        // Initialize from localStorage (which was set at login from backend)
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode !== null) {
            const isDark = savedMode === 'true';
            setDarkMode(isDark);
            applyTheme(isDark);
        }
        setLoading(false);
    }, []);

    const applyTheme = (isDark) => {
        if (isDark) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    };

    const toggleTheme = async () => {
        if (!isAuthenticated()) return;

        const user = getUser();
        
        try {
            const response = await fetch(`${API_BASE_URL}/felhasznalo/${user.felhasznalo_id}/sotetmod`, {
                method: 'PATCH'
            });

            if (response.ok) {
                const data = await response.json();
                const isDark = data.sotet_mod === 1;
                setDarkMode(isDark);
                localStorage.setItem('darkMode', isDark.toString());
                applyTheme(isDark);
            }
        } catch (error) {
            console.error('Error toggling theme:', error);
        }
    };

    if (!isAuthenticated()) {
        return (
            <div className="box profilebox">
                <h1 className="profileTitle">Sötét mód:</h1>
                <p>Jelentkezz be a téma beállításához!</p>
            </div>
        );
    }

    return (
        <div className="box profilebox">
            <h1 className="profileTitle">Sötét mód:</h1>
            <button 
                className={`button profileInput ${!darkMode ? 'selected' : ''}`}
                onClick={() => { if (darkMode) toggleTheme(); }}
                style={{ opacity: !darkMode ? 1 : 0.5 }}
            >
                Világos
            </button>
            <button 
                className={`button profileInput dark ${darkMode ? 'selected' : ''}`}
                onClick={() => { if (!darkMode) toggleTheme(); }}
                style={{ opacity: darkMode ? 1 : 0.5 }}
            >
                Sötét
            </button>
        </div>
    );
}
