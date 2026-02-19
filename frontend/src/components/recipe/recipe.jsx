import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import './styles/recipe-detail.css';
import '../profile/styles/preference-colors.css';
import CommentSection from './CommentSection';
import ReportModal from './ReportModal';

const API_BASE_URL = 'http://localhost:3001';

const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const postDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = today - postDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'ma';
    
    if (diffDays < 7) return 'a héten';
    
    if (diffDays < 30) return 'a hónapban';
    
    if (diffDays < 365) return 'idén';
    
    return 'több mint egy éve';
};

export default function RecipePage(){
    const { poszt_id } = useParams();
    const [recipeData, setRecipeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentRating, setCurrentRating] = useState(null);
    const [likeScore, setLikeScore] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    useEffect(() => {
        if (!poszt_id) return;
        setLoading(true);

        fetch(`${API_BASE_URL}/poszt/${poszt_id}`)
            .then(res => res.json())
            .then(data => {
                setRecipeData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch recipe details:', err);
                setLoading(false);
            });

        fetch(`${API_BASE_URL}/poszt/${poszt_id}/likescore`)
            .then(res => res.json())
            .then(data => setLikeScore(Number(data.like_score) || 0))
            .catch(err => console.error('Error fetching like score:', err));

        const token = localStorage.getItem('token');
        if (token) {
            fetch(`${API_BASE_URL}/poszt/${poszt_id}/szavazat`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => setCurrentRating(data.szavazat))
            .catch(err => console.error('Error fetching rating:', err));

            fetch(`${API_BASE_URL}/mentett`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => { if (res.ok) return res.json(); throw new Error(); })
            .then(data => {
                const savedIds = Array.isArray(data) ? data.map(r => r.poszt_id) : [];
                setIsSaved(savedIds.includes(Number(poszt_id)));
            })
            .catch(err => console.error('Error fetching saved status:', err));
        }
    }, [poszt_id]);

    const handleRating = async (type) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Bejelentkezés szükséges az értékeléshez');
            return;
        }
        const ratingValue = type === 'like' ? 1 : -1;
        const endpoint = type === 'like' ? 'like' : 'dislike';
        try {
            const response = await fetch(`${API_BASE_URL}/poszt/${poszt_id}/${endpoint}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                if (currentRating === ratingValue) {
                    setLikeScore(prev => prev - ratingValue);
                    setCurrentRating(null);
                } else if (currentRating === null) {
                    setLikeScore(prev => prev + ratingValue);
                    setCurrentRating(ratingValue);
                } else {
                    setLikeScore(prev => prev - currentRating + ratingValue);
                    setCurrentRating(ratingValue);
                }
            }
        } catch (error) {
            console.error('Error updating rating:', error);
        }
    };

    const handleSaveToggle = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Jelentkezz be a mentéshez!');
            return;
        }
        try {
            const method = isSaved ? 'DELETE' : 'POST';
            const response = await fetch(`${API_BASE_URL}/mentett/${poszt_id}`, {
                method,
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok || response.status === 409) {
                setIsSaved(!isSaved);
            }
        } catch (err) {
            console.error('Error toggling save:', err);
        }
    };

    if (loading) return (
        <main>
            <div className="recipe-detail-container">
                <h2>Betöltés...</h2>
            </div>
        </main>
    );

    if (!recipeData || !recipeData.poszt) return (
        <main>
            <div className="recipe-detail-container">
                <h2>A recept nem található</h2>
            </div>
        </main>
    );

    const poszt = recipeData.poszt;
    const hozzavalok = recipeData.hozzavalok || [];
    const lepesekSzoveg = recipeData.lepesSzoveg || '';

    const receptnev = poszt.poszt_cim || '';
    const datum = poszt.poszt_datum || '';
    const posztolo = poszt.feltolto || poszt.felhasznalo_nev || '';
    const leiras = poszt.poszt_leiras || '';
    const ar_val = poszt.ar_kategoria || null;
    const konyha = poszt.konyha_nev || '';
    const ido = poszt.poszt_ido || '';
    const fogas = poszt.fogas_nev || '';
    const nehezseg = poszt.nehezseg_kategoria || null;
    const kepUrl = poszt.poszt_kepurl || '';
    const preferenciak = poszt.allergiak
        ? poszt.allergiak.split(',').map(p => p.trim()).filter(p => p)
        : [];

    const getSeasonFromMonth = (m) => {
        if ([11,0,1].includes(m)) return 'tél';
        if ([2,3,4].includes(m)) return 'tavasz';
        if ([5,6,7].includes(m)) return 'nyár';
        return 'ősz';
    };

    const seasonLabel = (() => {
        try{
            const d = new Date(datum);
            if (isNaN(d)) return '';
            return getSeasonFromMonth(d.getMonth());
        }catch(e){ return '' }
    })();

    const priceLabel = (() => {
        if (!ar_val && ar_val !== 0) return '-';
        if (typeof ar_val === 'string'){
            const map = { 'olcsó':'$', 'közepes':'$$', 'drága':'$$$' };
            return `${ar_val} ${map[ar_val] ? `(${map[ar_val]})` : ''}`.trim();
        }
        const n = Number(ar_val) || 0;
        if (n <= 0) return '-';
        return '$'.repeat(Math.min(3, n));
    })();

    const diffLabel = (() => {
        if (!nehezseg && nehezseg !== 0) return '-';
        const map = { 'könnyű': '*', 'közepes': '**', 'nehéz': '***' };
        if (typeof nehezseg === 'string') return map[nehezseg] || nehezseg;
        const n = Number(nehezseg) || 0;
        if (n <= 0) return '-';
        return '*'.repeat(Math.min(3, n));
    })();

    let lepesekArray = [];
    if (lepesekSzoveg) {
        if (lepesekSzoveg.includes('|||')) {
            lepesekArray = lepesekSzoveg.split('|||');
        } else {
            lepesekArray = lepesekSzoveg.split(/\n+/);
        }
        
        lepesekArray = lepesekArray
            .map(s => s.trim())
            .map(s => s.replace(/^\d+\.\s*/, ''))
            .filter(s => s);
    }

    return (
        <main>
        <div className="recipe-detail-container">
            <h1 className="recipe-detail-title">{receptnev}</h1>
            
            <div className="recipe-detail-main">
                {/* Recipe image */}
                <div className="recipe-detail-image">
                    {kepUrl ? (
                        <img 
                            src={kepUrl.startsWith('http') ? kepUrl : `${API_BASE_URL}${kepUrl}`} 
                            alt={receptnev}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/400x300?text=Kep+nem+elerheto';
                            }}
                        />
                    ) : (
                        <div className="recipe-image-placeholder">Nincs kép</div>
                    )}
                </div>

                {/* Info section */}
                <div className="recipe-detail-info">
                    <div className="recipe-detail-meta">
                        <div>Posztolva: {getRelativeTime(datum)}</div>
                        <div>Posztoló: {posztolo}</div>
                    </div>
                    
                    {/* Preference badges */}
                    <div className="recipe-detail-badges">
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
                            return <span key={i} className={`preferenceBadge ${cls}`.trim()}>{p}</span>
                        })}
                    </div>

                    {/* Description */}
                    <div className="recipe-detail-description">
                        <div className="recipe-detail-description-title">Rövid leírása a receptnek:</div>
                        <div className="recipe-detail-description-text">{leiras}</div>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="recipe-actions">
                <button 
                    onClick={() => handleRating('like')}
                    className={`recipe-vote-btn ${currentRating === 1 ? 'active-like' : ''}`}
                >
                    ↑
                </button>
                <div className="recipe-score">
                    {likeScore}
                </div>
                <button 
                    onClick={() => handleRating('dislike')}
                    className={`recipe-vote-btn ${currentRating === -1 ? 'active-dislike' : ''}`}
                >
                    ↓
                </button>
                <button 
                    onClick={handleSaveToggle}
                    className={`recipe-action-btn ${isSaved ? 'recipe-unsave-btn' : 'recipe-save-btn'}`}
                >
                    {isSaved ? 'Mentés törlése' : 'Mentés'}
                </button>
                <button 
                    onClick={() => setShowReportModal(true)}
                    className="recipe-action-btn recipe-report-btn"
                >
                    Recept jelentése
                </button>
            </div>

            {showReportModal && (
                <ReportModal posztId={poszt_id} onClose={() => setShowReportModal(false)} />
            )}

            {/* Data cards */}
            <div className="recipe-detail-data">
                <div className="recipe-data-card">
                    <div className="recipe-data-label">Ár</div>
                    <div className="recipe-data-value">{priceLabel}</div>
                </div>
                <div className="recipe-data-card">
                    <div className="recipe-data-label">Konyha</div>
                    <div className="recipe-data-value">{konyha}</div>
                </div>
                <div className="recipe-data-card">
                    <div className="recipe-data-label">Elkészítési idő</div>
                    <div className="recipe-data-value">{ido} perc</div>
                </div>
                <div className="recipe-data-card">
                    <div className="recipe-data-label">Fogás</div>
                    <div className="recipe-data-value">{fogas}</div>
                </div>
                <div className="recipe-data-card">
                    <div className="recipe-data-label">Nehézség</div>
                    <div className="recipe-data-value">{diffLabel}</div>
                </div>
            </div>

            {/* Ingredients section */}
            {hozzavalok.length > 0 && (
                <div className="recipe-section">
                    <div className="recipe-section-title">Hozzávalók:</div>
                    <ul className="recipe-ingredients-list">
                        {hozzavalok.map((h, i) => (
                            <li key={i}>
                                {h.mennyiseg} {h.mertekegyseg_nev} {h.hozzavalo_nev}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Steps section */}
            {lepesekArray.length > 0 && (
                <div className="recipe-section">
                    <div className="recipe-section-title">Lépések:</div>
                    <ol className="recipe-steps-list">
                        {lepesekArray.map((lepes, i) => (
                            <li key={i}>{lepes}</li>
                        ))}
                    </ol>
                </div>
            )}

            <CommentSection posztId={poszt_id} />
        </div>
        </main>
    )
}
