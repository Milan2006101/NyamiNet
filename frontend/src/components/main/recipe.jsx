import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ReportModal from '../recipe/ReportModal';
import './styles/recipes.css';
import '../profile/styles/preference-buttons.css';
import '../profile/styles/preference-colors.css';

const API_BASE_URL = 'http://localhost:3001';

const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    
    // Reset time to midnight for accurate day comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const postDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = today - postDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Ma (today)
    if (diffDays === 0) return 'ma';
    
    // A héten (last 7 days)
    if (diffDays < 7) return 'a héten';
    
    // A hónapban (last 30 days)
    if (diffDays < 30) return 'a hónapban';
    
    // Idén (last 365 days)
    if (diffDays < 365) return 'idén';
    
    // Több mint egy éve (more than a year ago)
    return 'több mint egy éve';
};

export default function Recipe({poszt_id, poszt_cim, poszt_datum, poszt_leiras, poszt_kepurl, poszt_ido, ar_kategoria, konyha_nev, fogas_nev, nehezseg_kategoria, szezon_nev, allergiak, felhasznalo_nev, showDelete, onDelete, showSaveButton, isSaved, onSaveToggle}){

    const [currentRating, setCurrentRating] = useState(null); // 1 for like, -1 for dislike, null for none
    const [likeScore, setLikeScore] = useState(0);
    const [showReportModal, setShowReportModal] = useState(false);

    useEffect(() => {
        // Fetch like score
        const fetchLikeScore = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/poszt/${poszt_id}/likescore`);
                if (response.ok) {
                    const data = await response.json();
                    setLikeScore(Number(data.like_score) || 0);
                }
            } catch (error) {
                console.error('Error fetching like score:', error);
            }
        };

        // Fetch user's current vote for this recipe
        const fetchRating = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch(`${API_BASE_URL}/poszt/${poszt_id}/szavazat`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setCurrentRating(data.szavazat); // Will be 1, -1, or null
                }
            } catch (error) {
                console.error('Error fetching rating:', error);
            }
        };

        fetchLikeScore();
        if (showSaveButton) { // Only fetch if user is logged in
            fetchRating();
        }
    }, [poszt_id, showSaveButton]);

    const handleRating = async (e, type) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Bejelentkezés szükséges az értékeléshez');
            return;
        }

        const ratingValue = type === 'like' ? 1 : -1;
        const endpoint = type === 'like' ? 'like' : 'dislike';

        try {
            // If clicking the same button, the backend will toggle it off
            // If clicking different button, the backend will switch to new value
            const response = await fetch(`${API_BASE_URL}/poszt/${poszt_id}/${endpoint}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                // Update local score
                if (currentRating === ratingValue) {
                    // Removing the rating
                    setLikeScore(prev => prev - ratingValue);
                    setCurrentRating(null);
                } else if (currentRating === null) {
                    // Adding new rating
                    setLikeScore(prev => prev + ratingValue);
                    setCurrentRating(ratingValue);
                } else {
                    // Switching from opposite rating
                    setLikeScore(prev => prev - currentRating + ratingValue);
                    setCurrentRating(ratingValue);
                }
            }
        } catch (error) {
            console.error('Error updating rating:', error);
        }
    };

        const priceName = ar_kategoria || '-';
        const priceMapToNum = { 'olcsó': 1, 'közepes': 2, 'drága': 3 };
        const priceNum = priceMapToNum[String(ar_kategoria)] || 0;
        const priceSymbols = priceNum > 0 ? '$'.repeat(Math.min(3, priceNum)) : '';

        const difficultyMap = { 'könnyű': '*', 'közepes': '**', 'nehéz': '***' };
        const nehezsegLabel = nehezseg_kategoria ? (difficultyMap[nehezseg_kategoria] || nehezseg_kategoria) : '-';
    
    // Transform allergiak string to array for display
    const preferenciak = allergiak 
        ? allergiak.split(',').map(p => p.trim()).filter(p => p)
        : [];
    
    const navigate = useNavigate();
    const handleOpen = () => {
        navigate(`/recipe/${poszt_id}`);
    }

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm(`Biztosan törlöd a "${poszt_cim}" receptet?`)) {
            onDelete(poszt_id);
        }
    };

    const handleSaveToggle = (e) => {
        e.stopPropagation();
        if (onSaveToggle) {
            onSaveToggle(poszt_id, isSaved);
        }
    };

    const getSeasonFromMonth = (m) => {
        if ([11,0,1].includes(m)) return 'tél';
        if ([2,3,4].includes(m)) return 'tavasz';
        if ([5,6,7].includes(m)) return 'nyár';
        return 'ősz';
    };

    const seasonLabel = (() => {
        try{
            const d = new Date(poszt_datum);
            if (isNaN(d)) return '';
            return getSeasonFromMonth(d.getMonth());
        }catch(e){ return '' }
    })();

    return(
        <div className="recipe" onClick={handleOpen} style={{cursor:'pointer', position:'relative'}}>
            {showDelete && (
                <button 
                    onClick={handleDelete}
                    style={{
                        position: 'absolute',
                        bottom: '15px',
                        right: '15px',
                        padding: '12px 24px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        zIndex: 10
                    }}
                >
                    Törlés
                </button>
            )}
            {showSaveButton && (
                <div className="recipe-card-actions">
                    <button 
                        onClick={(e) => handleRating(e, 'like')}
                        className={`recipe-card-vote-btn ${currentRating === 1 ? 'active-like' : ''}`}
                    >
                        ↑
                    </button>
                    <div className="recipe-card-score">
                        {likeScore}
                    </div>
                    <button 
                        onClick={(e) => handleRating(e, 'dislike')}
                        className={`recipe-card-vote-btn ${currentRating === -1 ? 'active-dislike' : ''}`}
                    >
                        ↓
                    </button>
                    <button 
                        onClick={handleSaveToggle}
                        className={`recipe-card-action-btn ${isSaved ? 'recipe-card-unsave-btn' : 'recipe-card-save-btn'}`}
                    >
                        {isSaved ? 'Mentés törlése' : 'Mentés'}
                    </button>
                    
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowReportModal(true);
                        }}
                        className="recipe-card-action-btn recipe-card-report-btn"
                    >
                        Recept jelentése
                    </button>
                </div>
            )}
            {showReportModal && (
                <div onClick={e => e.stopPropagation()}>
                    <ReportModal posztId={poszt_id} onClose={() => setShowReportModal(false)} />
                </div>
            )}
            <div className="recipe1">
                <h1>{poszt_cim}</h1>
                <h3>Posztolva: {getRelativeTime(poszt_datum)}</h3>
                <h3>Posztoló: {felhasznalo_nev || 'Ismeretlen'}</h3>
                <div className="leiras">
                    <p>{poszt_leiras}</p>
                </div>
            </div>
            <div className="recipe2">
                <nobr><h3>Ár: {priceName}{priceSymbols ? ` (${priceSymbols})` : ''}</h3></nobr>
                <nobr><h3>Konyha: {konyha_nev || '-'}</h3></nobr>
                {seasonLabel ? <nobr><h3>Szezonalitás: {seasonLabel}</h3></nobr> : null}
                <nobr><h3>Elkészítési idő: {poszt_ido}p</h3></nobr>
                <nobr><h3>Fogás: {fogas_nev || '-'}</h3></nobr>
                <nobr><h3>Nehézség: {nehezsegLabel}</h3></nobr>
            </div>
            {poszt_kepurl && (
                <div className="recipe-image-middle">
                    <img 
                        src={poszt_kepurl.startsWith('http') ? poszt_kepurl : `${API_BASE_URL}${poszt_kepurl}`} 
                        alt={poszt_cim}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/250x250?text=Kép';
                        }}
                    />
                </div>
            )}
            <div className="recipe-right-column">
                {Array.isArray(preferenciak) && preferenciak.length ? (
                    <div className="recipe-preferences">
                        {preferenciak.map((p, i) => {
                            const l = (p||'').toLowerCase();
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
                ) : null}
            </div>
        </div>
    )
}