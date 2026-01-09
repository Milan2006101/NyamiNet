import { useEffect, useMemo, useState } from "react";

function PreferenceDropdown({ labels = [], selected = [], onChange }){
    const [open, setOpen] = useState(false);

    function toggleLabel(label){
        if (selected.includes(label)) onChange(selected.filter(s => s !== label));
        else onChange([...selected, label]);
    }

    return (    
        <>
            <button className="sideButton" onClick={() => setOpen(o=>!o)} style={{width:'100%'}}>
                {selected.length ? `${selected.length} kiválasztva` : 'Válassz preferenciákat'}
            </button>
            {open && (
                <div style={{marginTop:8,display:'flex',flexDirection:'column',gap:6,maxHeight:220,overflow:'auto'}}>
                    {labels.map(label => (
                        <label key={label} style={{display:'flex',alignItems:'center',gap:8}}>
                            <input type="checkbox" checked={selected.includes(label)} onChange={()=>toggleLabel(label)} />
                            <span>{label}</span>
                        </label>
                    ))}
                </div>
            )}
        </>
    );
}

const MONTH_NAMES = [
  'Január','Február','Március','Április','Május','Június','Július','Augusztus','Szeptember','Október','November','December'
];

export default function Sidebar({ originalReceptek = [], setReceptek }){
    const [price, setPrice] = useState(null);
    const [konyha, setKonyha] = useState("");
    const [timeRange, setTimeRange] = useState("");
    const [selectedPreferences, setSelectedPreferences] = useState([]);
    const [dateFilter, setDateFilter] = useState("");
    const [fogas, setFogas] = useState("");
    const [difficulty, setDifficulty] = useState(null);
    const [season, setSeason] = useState("");

    // derive unique values from originalReceptek (use name fields returned by SQL)
    const konyhaOptions = useMemo(() => [...new Set(originalReceptek.map(r => r.konyha_nev).filter(Boolean))], [originalReceptek]);
    const fogasOptions = useMemo(() => [...new Set(originalReceptek.map(r => r.fogas_nev).filter(Boolean))], [originalReceptek]);
    const arOptions = useMemo(() => [...new Set(originalReceptek.map(r => r.ar_kategoria).filter(Boolean))], [originalReceptek]);

    // preference labels will be derived from data when possible
    const PREFERENCE_LABELS_FALLBACK = [
        'vegán','vegetáriánus','mogyoró mentes','laktóz mentes','glutén mentes','cukor mentes','hal','szója mentes','tojás mentes','búza mentes'
    ];

    // Map numeric preference ids to labels (kept for safety)
    const PREF_MAP = {
        '1': ['vegán'],
        '2': ['vegetáriánus'],
        '3': ['mogyoró mentes'],
        '4': ['laktóz mentes']
    };

    const getSeasonFromMonth = (m) => {
        if ([11,0,1].includes(m)) return 'tél';
        if ([2,3,4].includes(m)) return 'tavasz';
        if ([5,6,7].includes(m)) return 'nyár';
        return 'ősz';
    };

    const seasonOptions = useMemo(() => {
        return [...new Set(originalReceptek.map(r => {
            try{
                const m = new Date(r.poszt_datum).getMonth();
                return getSeasonFromMonth(m);
            }catch(e){ return null }
        }).filter(Boolean))];
    }, [originalReceptek]);

    // derive preference labels from recipes (prefer array values)
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
        applyFilters();
    }, [price, konyha, timeRange, selectedPreferences, dateFilter, fogas, difficulty, season, preferenceOptions]);

    function applyFilters(){
        if (!originalReceptek || !setReceptek) return;
        let list = [...originalReceptek];

        if (price) list = list.filter(r => r.ar_kategoria === price);
        if (konyha) list = list.filter(r => r.konyha_nev === konyha);

        if (timeRange) {
            if (timeRange === '<30') list = list.filter(r => Number(r.poszt_ido || r.ido) < 30);
            if (timeRange === '30-60') list = list.filter(r => Number(r.poszt_ido || r.ido) >=30 && Number(r.poszt_ido || r.ido) <=60);
            if (timeRange === '60-180') list = list.filter(r => Number(r.poszt_ido || r.ido) >60 && Number(r.poszt_ido || r.ido) <=180);
            if (timeRange === '>180') list = list.filter(r => Number(r.poszt_ido || r.ido) > 180);
        }

        if (selectedPreferences && selectedPreferences.length){
            const recipeHasPreference = (prefVal, sp) => {
                if (Array.isArray(prefVal)){
                    if (prefVal.map(String).includes(sp)) return true;
                    for (const it of prefVal){
                        const mapped = PREF_MAP[String(it)] || [];
                        if (mapped.includes(sp)) return true;
                    }
                    return false;
                }
                if (typeof prefVal === 'string') return String(prefVal) === sp;
                const mapped = PREF_MAP[String(prefVal)] || [];
                return mapped.includes(sp) || String(prefVal) === sp;
            };

            list = list.filter(r => {
                const prefVal = r.allergiak || r.preferenciak;
                return selectedPreferences.every(sp => recipeHasPreference(prefVal, sp));
            });
        }

        if (dateFilter){
            const now = new Date();
            if (dateFilter === 'week'){
                const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
                list = list.filter(r => new Date(r.poszt_datum) >= weekAgo && new Date(r.poszt_datum) <= now);
            }
            if (dateFilter === 'month'){
                const monthAgo = new Date(now); monthAgo.setMonth(now.getMonth() - 1);
                list = list.filter(r => new Date(r.poszt_datum) >= monthAgo && new Date(r.poszt_datum) <= now);
            }
            if (dateFilter === 'year'){
                const yearAgo = new Date(now); yearAgo.setFullYear(now.getFullYear() - 1);
                list = list.filter(r => new Date(r.poszt_datum) >= yearAgo && new Date(r.poszt_datum) <= now);
            }
        }

        if (fogas) list = list.filter(r => r.fogas_nev === fogas);
        if (difficulty) list = list.filter(r => r.nehezseg_kategoria === difficulty);
        if (season) list = list.filter(r => {
            try{ return getSeasonFromMonth(new Date(r.poszt_datum).getMonth()) === season }catch(e){ return false }
        });

        setReceptek(list);
    }

    function clearFilters(){
        setPrice(null); setKonyha(""); setTimeRange(""); setSelectedPreferences([]); setDateFilter(""); setFogas(""); setDifficulty(null); setSeason("");
        if (setReceptek) setReceptek(originalReceptek || []);
    }

    return (
        <div className="sidebar">
            <div className="sideRow">
                <button className="sideButton" onClick={clearFilters}>Szűrők törlése</button>
            </div>
                

            <div>
                <h2 className="sideTitle">Ár:</h2>
                <div className="sideRow">
                    <button className={`sideButton three x-large-font ${price==='olcsó'? 'active':''}`} onClick={() => setPrice(prev => prev==='olcsó'? null:'olcsó')}>olcsó ($)</button>
                    <button className={`sideButton three x-large-font ${price==='közepes'? 'active':''}`} onClick={() => setPrice(prev => prev==='közepes'? null:'közepes')}>közepes ($$)</button>
                    <button className={`sideButton three x-large-font ${price==='drága'? 'active':''}`} onClick={() => setPrice(prev => prev==='drága'? null:'drága')}>drága ($$$)</button>
                </div>
            </div>

            <div>
                <h2 className="sideTitle">Konyha:</h2>
                <div className="sideRow">
                    <select className="sideSelect" value={konyha} onChange={e=>setKonyha(e.target.value)}>
                        <option value="">Összes</option>
                        {konyhaOptions.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <h2 className="sideTitle">Elkészítési idő:</h2>
                <div className="sideRow">
                    <button className={`sideButton ${timeRange==='<30'? 'active':''}`} onClick={() => setTimeRange(prev=> prev==='<30'? '': '<30')}>&lt; 30 perc</button>
                    <button className={`sideButton ${timeRange==='30-60'? 'active':''}`} onClick={() => setTimeRange(prev=> prev==='30-60'? '': '30-60')}>30-60 perc</button>
                    <button className={`sideButton ${timeRange==='60-180'? 'active':''}`} onClick={() => setTimeRange(prev=> prev==='60-180'? '': '60-180')}>1-3 óra</button>
                    <button className={`sideButton ${timeRange==='>180'? 'active':''}`} onClick={() => setTimeRange(prev=> prev==='>180'? '': '>180')}>3 óra &lt;</button>
                </div>
            </div>

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

            <div>
                <h2 className="sideTitle">Nehézség:</h2>
                <div className="sideRow">
                    <button className={`sideButton three x-large-font ${difficulty==='könnyű'? 'active':''}`} onClick={()=>setDifficulty(prev=> prev==='könnyű'? null:'könnyű')}>*</button>
                    <button className={`sideButton three x-large-font ${difficulty==='közepes'? 'active':''}`} onClick={()=>setDifficulty(prev=> prev==='közepes'? null:'közepes')}>**</button>
                    <button className={`sideButton three x-large-font ${difficulty==='nehéz'? 'active':''}`} onClick={()=>setDifficulty(prev=> prev==='nehéz'? null:'nehéz')}>***</button>
                </div>
            </div>

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
    )
}