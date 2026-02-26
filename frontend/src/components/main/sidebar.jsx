import { useEffect, useState } from "react";
import PreferenceDropdown from "./PreferenceDropdown";
import PriceFilter from "./PriceFilter";
import TimeFilter from "./TimeFilter";
import DifficultyFilter from "./DifficultyFilter";
import { getAuthHeaders, isAuthenticated, getToken } from "../../utils/auth";
import './styles/sidebar.css';

const API_BASE_URL = 'http://localhost:3001';

export default function Sidebar({ onFilterChange, className = '' }){
    const [price, setPrice] = useState(null);
    const [konyha, setKonyha] = useState("");
    const [timeRange, setTimeRange] = useState("");
    const [selectedPreferences, setSelectedPreferences] = useState([]);
    const [dateFilter, setDateFilter] = useState("");
    const [fogas, setFogas] = useState("");
    const [difficulty, setDifficulty] = useState(null);
    const [season, setSeason] = useState("");
    
    const [konyhaOptions, setKonyhaOptions] = useState([]);
    const [fogasOptions, setFogasOptions] = useState([]);
    const [preferenceOptions, setPreferenceOptions] = useState([]);
    const [seasonOptions, setSeasonOptions] = useState([]);
    const [authToken, setAuthToken] = useState(getToken());

    useEffect(() => {
        fetch(`${API_BASE_URL}/konyha`)
            .then(res => res.json())
            .then(data => setKonyhaOptions(data.map(item => item.konyha_nev)))
            .catch(err => console.error('Failed to fetch konyha options', err));

        fetch(`${API_BASE_URL}/fogas`)
            .then(res => res.json())
            .then(data => setFogasOptions(data.map(item => item.fogas_nev)))
            .catch(err => console.error('Failed to fetch fogas options', err));

        fetch(`${API_BASE_URL}/szezon`)
            .then(res => res.json())
            .then(data => setSeasonOptions(data.map(item => item.szezon_nev)))
            .catch(err => console.error('Failed to fetch szezon options', err));

        const allPreferences = [
            'vegán',
            'vegetáriánus',
            'laktózmentes',
            'gluténmentes',
            'mogyorók',
            'cukor',
            'hal',
            'szója',
            'tojás',
            'búza'
        ];
        setPreferenceOptions(allPreferences);
    }, []);

    useEffect(() => {
        const currentToken = getToken();
        setAuthToken(currentToken);

        if (!currentToken) {
            setSelectedPreferences([]);
            return;
        }

        if (isAuthenticated()) {
            fetch(`${API_BASE_URL}/felhasznalo/preferenciak`, {
                headers: getAuthHeaders()
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return [];
            })
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    const userPrefs = data.map(item => item.preferencia_nev);
                    setSelectedPreferences(userPrefs);
                } else {
                    setSelectedPreferences([]);
                }
            })
            .catch(err => {
                console.error('Failed to fetch user preferences', err);
                setSelectedPreferences([]);
            });
        }
    }, [authToken]);

    useEffect(() => {
        const handleLogout = () => {
            setSelectedPreferences([]);
            setAuthToken(null);
        };

        window.addEventListener('userLogout', handleLogout);
        return () => window.removeEventListener('userLogout', handleLogout);
    }, []);

    useEffect(() => {
        applyFilters();
    }, [price, konyha, timeRange, selectedPreferences, dateFilter, fogas, difficulty, season]);

    function applyFilters(){
        if (!onFilterChange) return;
        
        const params = new URLSearchParams();
        
        if (price) {
            const priceMap = { 'olcsó': 1, 'közepes': 2, 'drága': 3 };
            params.append('ar', priceMap[price]);
        }
        
        if (konyha) params.append('konyha', konyha);
        if (fogas) params.append('fogas', fogas);
        if (season) params.append('szezon', season);
        
        if (difficulty) {
            const difficultyMap = { 'könnyű': 1, 'közepes': 2, 'nehéz': 3 };
            params.append('nehezseg', difficultyMap[difficulty]);
        }
        
        if (timeRange) {
            const timeMap = { '<30': 1, '30-60': 2, '60-180': 3, '>180': 4 };
            params.append('elkeszitesi_ido', timeMap[timeRange]);
        }
        
        if (dateFilter) {
            if (dateFilter === 'week') params.append('nap', '7');
            else if (dateFilter === 'month') params.append('nap', '30');
            else if (dateFilter === 'year') params.append('nap', '365');
        }
        
        if (selectedPreferences && selectedPreferences.length) {
            params.append('preferencia', selectedPreferences.join(','));
        }
        
        params.append('sorrend', '2');
        
        onFilterChange(params);
    }

    function clearFilters(){
        setPrice(null); 
        setKonyha(""); 
        setTimeRange(""); 
        setSelectedPreferences([]); 
        setDateFilter(""); 
        setFogas(""); 
        setDifficulty(null); 
        setSeason("");
        if (onFilterChange) onFilterChange(new URLSearchParams());
    }

    return (
        <div className={`sidebar ${className}`}>
            <div className="sideRow">
                <button className="sideButton" style={{flex: '1 1 auto'}} onClick={clearFilters}>Szűrők törlése</button>
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
    )
}