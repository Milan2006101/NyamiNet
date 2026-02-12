import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser } from '../../utils/auth';
import SidebarAdmin from '../profile/sidebar_admin';
import '../profile/styles/preference-colors.css';
import '../profile/styles/preference-buttons.css';

const API_BASE_URL = 'http://localhost:3001';

export default function AdminReportDetail() {
    const { poszt_id } = useParams();
    const navigate = useNavigate();
    const user = getUser();
    const [recipe, setRecipe] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (!user || user.role_id !== 2) {
            navigate('/mainlogin');
            return;
        }
        fetchData();
    }, [poszt_id]);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            const recipeRes = await fetch(`${API_BASE_URL}/poszt/${poszt_id}`);
            if (recipeRes.ok) {
                const recipeData = await recipeRes.json();
                setRecipe(recipeData);
            }

            const reportsRes = await fetch(`${API_BASE_URL}/admin/report/poszt/${poszt_id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (reportsRes.ok) {
                const reportsData = await reportsRes.json();
                setReports(Array.isArray(reportsData) ? reportsData : []);
            }
        } catch (err) {
            console.error('Error fetching report details:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!window.confirm('Biztosan törölni szeretnéd a posztot?')) return;
        const token = localStorage.getItem('token');
        setActionLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/report/poszt/${poszt_id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert('Poszt törölve.');
                navigate('/admin/reports');
            } else {
                const data = await res.json();
                alert('Hiba: ' + (data.uzenet || 'Ismeretlen hiba'));
            }
        } catch (err) {
            console.error('Error deleting post:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        const token = localStorage.getItem('token');
        setActionLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/report/poszt/${poszt_id}/jovahagy`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert('Reportok elutasítva, a poszt megmarad.');
                navigate('/admin/reports');
            } else {
                alert('Hiba történt.');
            }
        } catch (err) {
            console.error('Error dismissing reports:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteAndBan = async () => {
        if (!window.confirm('Biztosan törölni szeretnéd a posztot ÉS tiltani a felhasználót?')) return;
        const token = localStorage.getItem('token');
        setActionLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/report/poszt/${poszt_id}/torlesban`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert('Poszt törölve és felhasználó tiltva.');
                navigate('/admin/reports');
            } else {
                alert('Hiba történt.');
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <main style={{ display: 'flex' }}>
                <div style={{ flex: 1, padding: '20px' }}>
                    <h2>Betöltés...</h2>
                </div>
                <SidebarAdmin />
            </main>
        );
    }

    const poszt = recipe?.poszt || {};
    const receptnev = poszt.poszt_cim || '';
    const posztolo = poszt.feltolto || '';
    const leiras = poszt.poszt_leiras || '';
    const datum = poszt.poszt_datum || '';
    const kepUrl = poszt.poszt_kepurl || '';
    const ido = poszt.poszt_ido || '';
    const konyha = poszt.konyha_nev || '';
    const fogas = poszt.fogas_nev || '';
    const nehezseg = poszt.nehezseg_kategoria || '';
    const ar = poszt.ar_kategoria || '';
    const hozzavalok = recipe?.hozzavalok || [];
    const lepesekSzoveg = recipe?.lepesSzoveg || '';
    const preferenciak = poszt.allergiak
        ? poszt.allergiak.split(',').map(p => p.trim()).filter(p => p)
        : [];

    const priceMap = { 'olcsó': '$', 'közepes': '$$', 'drága': '$$$' };
    const diffMap = { 'könnyű': '★', 'közepes': '★★', 'nehéz': '★★★' };

    let lepesekArray = [];
    if (lepesekSzoveg) {
        if (lepesekSzoveg.includes('|||')) {
            lepesekArray = lepesekSzoveg.split('|||');
        } else {
            lepesekArray = lepesekSzoveg.split(/\n+/);
        }
        lepesekArray = lepesekArray.map(s => s.trim()).map(s => s.replace(/^\d+\.\s*/, '')).filter(s => s);
    }

    const mainIndoklas = reports.length > 0 ? reports[0].indoklas_szoveg : '';

    const getRelativeTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Ma';
        if (diffDays < 7) return 'Egy Hete';
        if (diffDays < 30) return 'Egy Hónapja';
        if (diffDays < 365) return 'Idén';
        return 'Több mint egy éve';
    };

    return (
        <main style={{ display: 'flex' }}>
            <div style={{ flex: 1, padding: '20px' }}>
                <h1 style={{ color: 'var(--text-accent)', marginBottom: '5px' }}>Reportolt poszt megtekintése</h1>

                {/* Indoklás header */}
                <h2 style={{
                    color: 'var(--text-accent-red)',
                    marginBottom: '20px',
                    fontSize: '18px'
                }}>
                    Indoklás: {mainIndoklas || 'Nincs megadva'}
                </h2>

                {/* Main recipe card */}
                <div style={{
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '15px',
                    padding: '25px',
                    marginBottom: '20px'
                }}>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {/* Left column - recipe info */}
                        <div style={{ flex: '1 1 300px' }}>
                            <h2 style={{ color: 'var(--text-accent-red)', margin: '0 0 5px 0' }}>{receptnev}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '0 0 2px 0' }}>
                                Posztolva: {getRelativeTime(datum)}
                            </p>
                            <p style={{ color: 'var(--text-accent-red)', fontSize: '12px', margin: '0 0 15px 0' }}>
                                Posztoló: {posztolo}
                            </p>

                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '15px' }}>
                                <i>Rövid leírása a receptnek: {leiras}</i>
                            </p>

                            <p style={{ marginBottom: '4px' }}><b>Ár:</b> {priceMap[ar] || ar || '-'}</p>
                            <p style={{ marginBottom: '4px' }}><b>Konyha:</b> {konyha || '-'}</p>
                            <p style={{ marginBottom: '4px' }}><b>Elkészítési idő:</b> {ido} perc</p>
                            <p style={{ marginBottom: '4px' }}><b>Fogás:</b> {fogas || '-'}</p>
                            <p style={{ marginBottom: '15px' }}><b>Nehézség:</b> {diffMap[nehezseg] || nehezseg || '-'}</p>

                            {/* Action buttons */}
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <button
                                    onClick={handleApprove}
                                    disabled={actionLoading}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: 'var(--bg-card)',
                                        color: 'var(--text-accent-red)',
                                        border: '2px solid var(--text-accent-red)',
                                        borderRadius: '25px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '14px'
                                    }}
                                >
                                    Report elfogadása
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={actionLoading}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: 'var(--bg-card)',
                                        color: '#28a745',
                                        border: '2px solid #28a745',
                                        borderRadius: '25px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '14px'
                                    }}
                                >
                                    Report elutasítása
                                </button>
                            </div>
                        </div>

                        {/* Right column - image + badges + report count */}
                        <div style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 'bold' }}>Reportok száma</span>
                                <span style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: '18px' }}>{reports.length}</span>
                            </div>

                            {/* Image */}
                            <div style={{
                                width: '250px',
                                height: '200px',
                                backgroundColor: 'var(--bg-input)',
                                border: '2px solid var(--text-primary)',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '12px'
                            }}>
                                {kepUrl ? (
                                    <img
                                        src={kepUrl.startsWith('http') ? kepUrl : `${API_BASE_URL}${kepUrl}`}
                                        alt={receptnev}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/250x200?text=Kep'; }}
                                    />
                                ) : (
                                    <span style={{ color: 'var(--text-faint)' }}>Nincs kép</span>
                                )}
                            </div>

                            {/* Preference badges */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                                {Array.isArray(preferenciak) && preferenciak.map((p, i) => {
                                    const l = (p || '').toLowerCase();
                                    let cls = '';
                                    if (l.includes('vegán') || l.includes('vegetári')) cls = 'veg';
                                    else if (l.includes('mogyor')) cls = 'nut';
                                    else if (l.includes('laktóz')) cls = 'lactose';
                                    else if (l.includes('glut')) cls = 'gluten';
                                    else if (l.includes('cukor')) cls = 'sugar';
                                    else if (l.includes('hal')) cls = 'fish';
                                    else if (l.includes('szója') || l.includes('szoja')) cls = 'soy';
                                    else if (l.includes('tojás') || l.includes('tojas')) cls = 'egg';
                                    else if (l.includes('búza') || l.includes('buza')) cls = 'wheat';
                                    return <span key={i} className={`preferenceBadge ${cls}`.trim()}>{p}</span>;
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ingredients and Steps */}
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    {hozzavalok.length > 0 && (
                        <div style={{
                            flex: '1 1 300px',
                            backgroundColor: 'var(--bg-card)',
                            borderRadius: '12px',
                            padding: '20px'
                        }}>
                            <h3>Hozzávalók:</h3>
                            <ul style={{ paddingLeft: '20px' }}>
                                {hozzavalok.map((h, i) => (
                                    <li key={i} style={{ marginBottom: '4px' }}>
                                        {h.mennyiseg} {h.mertekegyseg_nev} {h.hozzavalo_nev}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {lepesekArray.length > 0 && (
                        <div style={{
                            flex: '1 1 300px',
                            backgroundColor: 'var(--bg-card)',
                            borderRadius: '12px',
                            padding: '20px'
                        }}>
                            <h3>Lépések:</h3>
                            <ol style={{ paddingLeft: '20px' }}>
                                {lepesekArray.map((l, i) => (
                                    <li key={i} style={{ marginBottom: '4px' }}>{l}</li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>

                {/* Delete and Ban button */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <button
                        onClick={handleDeleteAndBan}
                        disabled={actionLoading}
                        style={{
                            padding: '15px 40px',
                            backgroundColor: '#BF3131',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '18px',
                            width: '100%',
                            maxWidth: '500px'
                        }}
                    >
                        Report elfogadása & fiók tiltása
                    </button>
                </div>
            </div>
            <SidebarAdmin />
        </main>
    );
}
