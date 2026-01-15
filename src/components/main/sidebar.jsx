import { useEffect, useMemo, useState } from "react";
import PreferenceDropdown from "./PreferenceDropdown.jsx";
import PriceFilter from "./PriceFilter.jsx";
import TimeFilter from "./TimeFilter.jsx";
import DifficultyFilter from "./DifficultyFilter.jsx";
import { applyAllFilters, getSeasonFromMonth } from "./filterLogic.js";

const PREFERENCE_LABELS_FALLBACK = [
    'vegán','vegetáriánus','mogyoró mentes','laktóz mentes','glutén mentes',
    'cukor mentes','hal','szója mentes','tojás mentes','búza mentes'
];

const PREF_MAP = {
    '1': ['vegán'],
    '2': ['vegetáriánus'],
    '3': ['mogyoró mentes'],
    '4': ['laktóz mentes']
};

export default function Sidebar({ originalReceptek = [], setReceptek }){
    const [price, setPrice] = useState(null);
    const [konyha, setKonyha] = useState("");
    const [timeRange, setTimeRange] = useState("");
    const [selectedPreferences, setSelectedPreferences] = useState([]);
    const [dateFilter, setDateFilter] = useState("");
    const [fogas, setFogas] = useState("");
    const [difficulty, setDifficulty] = useState(null);
    const [season, setSeason] = useState("");

    const konyhaOptions = useMemo(() => 
        [...new Set(originalReceptek.map(r => r.konyha_nev).filter(Boolean))], 
        [originalReceptek]
    );
    
    const fogasOptions = useMemo(() => 
        [...new Set(originalReceptek.map(r => r.fogas_nev).filter(Boolean))], 
        [originalReceptek]
    );

    const seasonOptions = useMemo(() => {
        return [...new Set(originalReceptek.map(r => {
            try{
                const m = new Date(r.poszt_datum).getMonth();
                return getSeasonFromMonth(m);
            }catch(e){ return null }
        }).filter(Boolean))];
    }, [originalReceptek]);

    const preferenceOptions = useMemo(() => {
        const fromData = new Set();
        originalReceptek.forEach(r => {
            const p = r.allergiak || r.preferenciak;
            if (Array.isArray(p)) p.forEach(x => x && fromData.add(x));
            else if (typeof p === 'string' && p) p.split(',').map(s => s.trim()).forEach(x => x && fromData.add(x));
            else if (typeof p === 'number' && PREF_MAP[String(p)]) PREF_MAP[String(p)].forEach(x => fromData.add(x));
        });
        const out = Array.from(fromData);
        return out.length ? out : PREFERENCE_LABELS_FALLBACK;
    }, [originalReceptek]);

    useEffect(() => {
        if (!originalReceptek || !setReceptek) return;
        const filtered = applyAllFilters(originalReceptek, {
            price, konyha, timeRange, selectedPreferences, dateFilter, fogas, difficulty, season
        });
        setReceptek(filtered);
    }, [price, konyha, timeRange, selectedPreferences, dateFilter, fogas, difficulty, season]);

    function clearFilters(){
        setPrice(null); 
        setKonyha(""); 
        setTimeRange(""); 
        setSelectedPreferences([]); 
        setDateFilter(""); 
        setFogas(""); 
        setDifficulty(null); 
        setSeason("");
        if (setReceptek) setReceptek(originalReceptek || []);
    }

    return (
        <div className="sidebar">
            <div className="sideRow">
                <button className="sideButton" onClick={clearFilters}>
                    Szűrők törlése
                </button>
            </div>

            <PriceFilter price={price} setPrice={setPrice} />

            <div>
                <h2 className="sideTitle">Konyha:</h2>
                <div className="sideRow">
                    <select className="sideSelect" value={konyha} onChange={e=>setKonyha(e.target.value)}>
                        <option value="">Összes</option>
                        {konyhaOptions.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                </div>
            </div>

            <TimeFilter timeRange={timeRange} setTimeRange={setTimeRange} />

            <div>
                <h2 className="sideTitle">Étel preferenciák:</h2>
                <div className="sideRow">
                    <PreferenceDropdown
                        labels={preferenceOptions}
                        selected={selectedPreferences}
                        onChange={(next)=>setSelectedPreferences(next)}
                    />
                </div>
            </div>

            <div>
                <h2 className="sideTitle">Dátum:</h2>
                <div className="sideRow">
                    <select className="sideSelect" value={dateFilter} onChange={e=>setDateFilter(e.target.value)}>
                        <option value="">Összes</option>
                        <option value="week">előző hét</option>
                        <option value="month">előző hónap</option>
                        <option value="year">előző év</option>
                    </select>
                </div>
            </div>

            <div>
                <h2 className="sideTitle">Fogás:</h2>
                <div className="sideRow">
                    <select className="sideSelect" value={fogas} onChange={e=>setFogas(e.target.value)}>
                        <option value="">Összes</option>
                        {fogasOptions.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
            </div>

            <DifficultyFilter difficulty={difficulty} setDifficulty={setDifficulty} />

            <div>
                <h2 className="sideTitle">Szezonalitás:</h2>
                <div className="sideRow last">
                    <select className="sideSelect" value={season} onChange={e=>setSeason(e.target.value)}>
                        <option value="">Összes</option>
                        {seasonOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
}