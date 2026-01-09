import { useLocation } from "react-router-dom";
import NavbarLogin from "../navbar/navbarLogin.jsx";
import NavbarBack from "../navbar/navbarBack.jsx";
import Footer from "../navbar/footer.jsx";

export default function RecipePage(){
    const location = useLocation();
    const recipe = location.state?.recipe;

    const user = (()=>{
        try{ return JSON.parse(localStorage.getItem('user')); }catch(e){ return null; }
    })();

    if(!recipe) return (
        <>
        {user ? <NavbarLogin /> : <NavbarBack />}
        <section style={{padding:20}}>
            <h2>Nincs kiválasztott recept</h2>
        </section>
        <Footer />
        </>
    )

    const receptnev = recipe.poszt_cim || recipe.receptnev || '';
    const datum = recipe.poszt_datum || recipe.datum || '';
    const posztolo = recipe.felhasznalo_nev || recipe.posztolo || '';
    const leiras = recipe.poszt_leiras || recipe.leiras || '';
    const ar_val = recipe.ar_kategoria || recipe.ar || recipe.ar_id || null;
    const konyha = recipe.konyha_nev || recipe.konyha || '';
    const ido = recipe.poszt_ido || recipe.ido || '';
    const fogas = recipe.fogas_nev || recipe.fogas || '';
    const nehezseg = recipe.nehezseg_kategoria || recipe.nehezseg || null;
    const preferenciak = recipe.preferenciak || recipe.preferenciak || recipe.allergiak || [];

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

    return (
        <>
        {user ? <NavbarLogin /> : <NavbarBack />}
        <section style={{padding:20}}>
            <h1>{receptnev}</h1>
            <h4>Posztolva: {datum} — Posztoló: {posztolo}</h4>
            <div style={{marginTop:12}}>
                <h3>Leírás</h3>
                <p>{leiras}</p>
            </div>

            <div style={{marginTop:12}}>
                <h3>Adatok</h3>
                <p>Ár: {priceLabel}</p>
                <p>Konyha: {konyha}</p>
                    {seasonLabel ? <p>Szezonalitás: {seasonLabel}</p> : null}
                <p>Elkészítési idő: {ido}p</p>
                <p>Fogás: {fogas}</p>
                <p>Nehézség: {diffLabel}</p>
            </div>

            {Array.isArray(preferenciak) && preferenciak.length ? (
                <div style={{marginTop:12}}>
                    <h3>Preferenciák</h3>
                    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                        {preferenciak.map((p,i) => {
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
                </div>
            ) : null}
        </section>
        <Footer />
        </>
    )
}
