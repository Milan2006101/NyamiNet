import { useNavigate } from "react-router-dom";

export default function Recipe({poszt_cim, poszt_datum, poszt_leiras, poszt_kepurl, poszt_ido, ar_kategoria, konyha_nev, fogas_nev, nehezseg_kategoria, szezon_nev, allergiak, preferenciak}){

        const priceName = ar_kategoria || '-';
        const priceMapToNum = { 'olcsó': 1, 'közepes': 2, 'drága': 3 };
        const priceNum = priceMapToNum[String(ar_kategoria)] || 0;
        const priceSymbols = priceNum > 0 ? '$'.repeat(Math.min(3, priceNum)) : '';

        const difficultyMap = { 'könnyű': '*', 'közepes': '**', 'nehéz': '***' };
        const nehezsegLabel = nehezseg_kategoria ? (difficultyMap[nehezseg_kategoria] || nehezseg_kategoria) : '-';
    const navigate = useNavigate();
    const handleOpen = () => {
        navigate('/recipe', { state: { recipe: { poszt_cim, poszt_datum, poszt_leiras, poszt_kepurl, poszt_ido, ar_kategoria, konyha_nev, fogas_nev, nehezseg_kategoria, szezon_nev, preferenciak, allergiak } } });
    }

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
        <div className="recipe" onClick={handleOpen} style={{cursor:'pointer'}}>
            <div className="recipe1">
                <h1>{poszt_cim}</h1>
                <h3>Posztolva: {poszt_datum ? new Date(poszt_datum).toLocaleDateString() : ''}</h3>
                <div className="leiras">
                    <p>{poszt_leiras}</p>
                </div>
                {poszt_kepurl && <img src={poszt_kepurl} alt={poszt_cim} style={{maxWidth:'100%'}} />}
            </div>
            <div className="recipe2">
                <nobr><h3>Ár: {priceName}{priceSymbols ? ` (${priceSymbols})` : ''}</h3></nobr>
                <nobr><h3>Konyha: {konyha_nev || '-'}</h3></nobr>
                {seasonLabel ? <nobr><h3>Szezonalitás: {seasonLabel}</h3></nobr> : null}
                <nobr><h3>Elkészítési idő: {poszt_ido}p</h3></nobr>
                <nobr><h3>Fogás: {fogas_nev || '-'}</h3></nobr>
                <nobr><h3>Nehézség: {nehezsegLabel}</h3></nobr>
            </div>
            <div style={{marginTop:8}}>
                {Array.isArray(preferenciak) && preferenciak.length ? (
                    <div style={{display:'flex',gap:8,flexWrap:'wrap', marginTop:12}}>
                        {preferenciak.map((p, i) => <span key={i} className="preferenceBadge">{p}</span>)}
                    </div>
                ) : null}
            </div>
        </div>
    )
}