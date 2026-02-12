import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../utils/auth';
import SidebarAdmin from '../profile/sidebar_admin';

const API_BASE_URL = 'http://localhost:3001';

export default function AdminReportList() {
    const navigate = useNavigate();
    const user = getUser();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regPassword2, setRegPassword2] = useState('');
    const [regPrefs, setRegPrefs] = useState([]);
    const [prefOptions, setPrefOptions] = useState([]);
    const [prefDropdownOpen, setPrefDropdownOpen] = useState(false);
    const [regError, setRegError] = useState('');
    const [regSuccess, setRegSuccess] = useState('');
    const [regLoading, setRegLoading] = useState(false);

    useEffect(() => {
        if (!user || user.role_id !== 2) {
            navigate('/mainlogin');
            return;
        }
        fetchReports();
        fetchPreferences();
    }, []);

    const fetchReports = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/admin/report/osszes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setReports(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error('Error fetching reports:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPreferences = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/preferenciak`);
            if (res.ok) {
                const data = await res.json();
                setPrefOptions(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error('Error fetching preferences:', err);
        }
    };

    const togglePref = (id) => {
        setRegPrefs(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleAdminRegister = async () => {
        setRegError('');
        setRegSuccess('');

        if (!regName || !regEmail || !regPassword) {
            setRegError('Minden mező kitöltése kötelező!');
            return;
        }
        if (regPassword !== regPassword2) {
            setRegError('A jelszavak nem egyeznek!');
            return;
        }

        setRegLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/auth/regisztracio`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    felhasznalo_nev: regName,
                    email: regEmail,
                    jelszo: regPassword,
                    preferenciak: regPrefs,
                    role_id: 2
                })
            });
            const data = await res.json();
            if (res.ok) {
                setRegSuccess(data.uzenet || 'Admin felhasználó létrehozva!');
                setRegName('');
                setRegEmail('');
                setRegPassword('');
                setRegPassword2('');
                setRegPrefs([]);
            } else {
                setRegError(data.uzenet || 'Hiba történt');
            }
        } catch {
            setRegError('Hálózati hiba');
        } finally {
            setRegLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '8px 10px',
        borderRadius: '6px',
        border: '1px solid var(--border-color)',
        fontSize: '14px',
        boxSizing: 'border-box',
        marginBottom: '4px',
        backgroundColor: 'var(--bg-input)',
        color: 'var(--text-primary)'
    };

    const labelStyle = {
        fontSize: '12px',
        color: 'var(--text-secondary)',
        marginBottom: '2px',
        display: 'block'
    };

    return (
        <main className="wrap">
            {/* Report table */}
            <div style={{ flex: 1, minWidth: 0, overflowX: 'auto' }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px'
                }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Reportot kezdeményező felhasználó</th>
                            <th style={thStyle}>Report indoklás</th>
                            <th style={thStyle}>Reportolt recept neve</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={3} style={{ padding: '16px' }}>Betöltés...</td></tr>
                        ) : reports.length === 0 ? (
                            <tr><td colSpan={3} style={{ padding: '16px' }}>Nincsenek jelentések.</td></tr>
                        ) : (
                            reports.map((r, i) => (
                                <tr
                                    key={r.report_id || i}
                                    onClick={() => navigate(`/admin/report/${r.poszt_id}`)}
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: i % 2 === 0 ? 'var(--bg-card-alt)' : 'var(--bg-card)'
                                    }}
                                >
                                    <td style={tdStyle}>{r.reportolo_nev || '-'}</td>
                                    <td style={tdStyle}>{r.indoklas_szoveg || '-'}</td>
                                    <td style={{ ...tdStyle, color: 'var(--text-accent-red)' }}>{r.poszt_cim || '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Admin user creation form */}
            <div style={{
                flex: 1,
                minWidth: '280px',
                maxWidth: '400px',
                padding: '0 20px'
            }}>
                <h2 style={{ color: 'var(--text-accent)', marginBottom: '15px', fontSize: '20px' }}>
                    Admin felhasználó létrehozása
                </h2>

                {regError && <p style={{ color: 'var(--text-accent-red)', fontSize: '13px', marginBottom: '8px' }}>{regError}</p>}
                {regSuccess && <p style={{ color: '#2e7d32', fontSize: '13px', marginBottom: '8px' }}>{regSuccess}</p>}

                <label style={labelStyle}>Név</label>
                <input
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    style={inputStyle}
                />

                <label style={labelStyle}>Jelszó</label>
                <input
                    type="password"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    style={inputStyle}
                />

                <label style={labelStyle}>Jelszó megerősítése</label>
                <input
                    type="password"
                    value={regPassword2}
                    onChange={e => setRegPassword2(e.target.value)}
                    style={inputStyle}
                />

                <label style={labelStyle}>Email</label>
                <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    style={inputStyle}
                />

                {/* Preferences dropdown */}
                <div style={{ position: 'relative', marginTop: '8px', marginBottom: '16px' }}>
                    <div
                        onClick={() => setPrefDropdownOpen(!prefDropdownOpen)}
                        style={{
                            ...inputStyle,
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 0
                        }}
                    >
                        <span style={{ color: regPrefs.length > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                            {regPrefs.length > 0
                                ? prefOptions.filter(p => regPrefs.includes(p.preferencia_id)).map(p => p.preferencia_nev).join(', ')
                                : 'Étel preferenciák'}
                        </span>
                        <span style={{ fontSize: '10px' }}>{prefDropdownOpen ? '▲' : '▼'}</span>
                    </div>
                    {prefDropdownOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            backgroundColor: 'var(--bg-dropdown)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0 0 6px 6px',
                            zIndex: 10,
                            maxHeight: '160px',
                            overflowY: 'auto'
                        }}>
                            {prefOptions.map(p => (
                                <div
                                    key={p.preferencia_id}
                                    onClick={() => togglePref(p.preferencia_id)}
                                    style={{
                                        padding: '6px 10px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        backgroundColor: regPrefs.includes(p.preferencia_id) ? 'var(--bg-dropdown-hover)' : 'var(--bg-dropdown)'
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={regPrefs.includes(p.preferencia_id)}
                                        readOnly
                                        style={{ accentColor: '#7D0A0A' }}
                                    />
                                    <span style={{ fontSize: '13px' }}>{p.preferencia_nev}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleAdminRegister}
                    disabled={regLoading}
                    style={{
                        padding: '10px 28px',
                        backgroundColor: 'var(--btn-admin-bg)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: regLoading ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        opacity: regLoading ? 0.7 : 1
                    }}
                >
                    {regLoading ? 'Létrehozás...' : 'Regisztráció'}
                </button>
            </div>

            <SidebarAdmin />
        </main>
    );
}

const thStyle = {
    textAlign: 'left',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontWeight: 'bold',
    backgroundColor: 'var(--bg-card)',
    borderBottom: '2px solid var(--border-accent)'
};

const tdStyle = {
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontWeight: '400'
};
