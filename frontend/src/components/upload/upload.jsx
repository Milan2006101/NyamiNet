import { useState, useEffect } from 'react';
import { getUser, isAuthenticated } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import './styles/upload.css';
import '../main/styles/sidebar.css';

const API_BASE_URL = 'http://localhost:3001';

export default function Upload(){
    const navigate = useNavigate();
    const user = getUser();

    const [formData, setFormData] = useState({
        poszt_cim: '',
        poszt_leiras: '',
        poszt_adag: '',
        poszt_ido: '',
        ar_id: null,
        konyha_id: null,
        fogas_id: null,
        nehezseg_id: null,
        szezon_id: null,
        alcimek: ''
    });

    const [hozzavalok, setHozzavalok] = useState([
        { mennyiseg: '', mertekegyseg_nev: '', hozzavalo_nev: '' }
    ]);
    const [lepesek, setLepesek] = useState(['']);

    const [konyhaOptions, setKonyhaOptions] = useState([]);
    const [fogasOptions, setFogasOptions] = useState([]);
    const [szezonOptions, setSzezonOptions] = useState([]);
    const [mertekegysegOptions, setMertekegysegOptions] = useState([]);
    const [hozzavaloOptions, setHozzavaloOptions] = useState([]);
    const [preferenciaOptions, setPreferenciaOptions] = useState([]);

    const [selectedPreferences, setSelectedPreferences] = useState([]);

    const [imageFile, setImageFile] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        fetchOptions();
    }, [navigate]);

    const fetchOptions = async () => {
        try {
            const [konyhaRes, fogasRes, szezonRes, mertekRes, hozzaRes, prefRes] = await Promise.all([
                fetch(`${API_BASE_URL}/konyha`),
                fetch(`${API_BASE_URL}/fogas`),
                fetch(`${API_BASE_URL}/szezon`),
                fetch(`${API_BASE_URL}/mertekegyseg`),
                fetch(`${API_BASE_URL}/hozzavalok`),
                fetch(`${API_BASE_URL}/preferenciak`)
            ]);

            const konyhaData = await konyhaRes.json();
            const fogasData = await fogasRes.json();
            const szezonData = await szezonRes.json();
            const mertekData = await mertekRes.json();
            const hozzaData = await hozzaRes.json();
            const prefData = await prefRes.json();

            setKonyhaOptions(konyhaData);
            setFogasOptions(fogasData);
            setSzezonOptions(szezonData);
            setMertekegysegOptions(mertekData);
            setHozzavaloOptions(hozzaData);
            setPreferenciaOptions(prefData);
        } catch (error) {
            console.error('Error fetching options:', error);
            alert('Hiba történt az adatok betöltése során. Ellenőrizd, hogy a backend fut-e!');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert('Csak JPEG, PNG, GIF vagy WebP képek engedélyezettek!');
                e.target.value = '';
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('A kép mérete maximum 5MB lehet!');
                e.target.value = '';
                return;
            }
            setImageFile(file);
        }
    };

    const handleHozzavaloChange = (index, field, value) => {
        const updated = [...hozzavalok];
        updated[index][field] = value;
        setHozzavalok(updated);
    };

    const addHozzavalo = () => {
        setHozzavalok([...hozzavalok, { mennyiseg: '', mertekegyseg_nev: '', hozzavalo_nev: '' }]);
    };

    const removeHozzavalo = (index) => {
        if (hozzavalok.length > 1) {
            setHozzavalok(hozzavalok.filter((_, i) => i !== index));
        }
    };

    const handleLepesChange = (index, value) => {
        const updated = [...lepesek];
        updated[index] = value;
        setLepesek(updated);
    };

    const addLepes = () => {
        setLepesek([...lepesek, '']);
    };

    const removeLepes = (index) => {
        if (lepesek.length > 1) {
            setLepesek(lepesek.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async () => {
        if (!isAuthenticated() || !user) {
            alert('Jelentkezz be a recept feltöltéséhez!');
            return;
        }

        // Validation
        if (!formData.poszt_cim.trim()) {
            alert('Add meg a recept nevét!');
            return;
        }

        if (!formData.ar_id || !formData.nehezseg_id) {
            alert('Válaszd ki az árat és a nehézséget!');
            return;
        }

        if (!imageFile) {
            alert('Kérlek válassz egy képet a recepthez!');
            return;
        }

        setLoading(true);

        try {
            for (const h of hozzavalok) {
                const trimmedHozzavalo = h.hozzavalo_nev?.trim();
                const trimmedMertekegyseg = h.mertekegyseg_nev?.trim();
                const trimmedMennyiseg = h.mennyiseg?.trim();

                if (!trimmedHozzavalo || !trimmedMertekegyseg || !trimmedMennyiseg) {
                    alert('Kérlek töltsd ki az összes hozzávaló mezőt!');
                    setLoading(false);
                    return;
                }
            }

            const lepesek_szoveg = lepesek
                .filter(lep => lep.trim())
                .join('|||');

            const formDataToSend = new FormData();
            formDataToSend.append('kep', imageFile);
            formDataToSend.append('poszt_cim', formData.poszt_cim);
            formDataToSend.append('poszt_leiras', formData.poszt_leiras || '');
            formDataToSend.append('poszt_ido', parseInt(formData.poszt_ido) || 0);
            formDataToSend.append('poszt_adag', parseInt(formData.poszt_adag) || 1);
            formDataToSend.append('felhasznalo_id', user.felhasznalo_id);
            formDataToSend.append('ar_id', formData.ar_id || '');
            formDataToSend.append('konyha_id', formData.konyha_id || '');
            formDataToSend.append('fogas_id', formData.fogas_id || '');
            formDataToSend.append('nehezseg_id', formData.nehezseg_id || '');
            formDataToSend.append('szezon_id', formData.szezon_id || '');
            formDataToSend.append('lepesek_szoveg', lepesek_szoveg);
            formDataToSend.append('hozzavalok', JSON.stringify(hozzavalok.map(h => ({
                hozzavalo_nev: h.hozzavalo_nev.trim(),
                mertekegyseg_nev: h.mertekegyseg_nev.trim(),
                mennyiseg: h.mennyiseg.trim()
            }))));
            formDataToSend.append('preferenciak', selectedPreferences.join(','));
            formDataToSend.append('alcimek', formData.alcimek || '');

            const response = await fetch(`${API_BASE_URL}/poszt`, {
                method: 'POST',
                body: formDataToSend
            });

            if (response.ok) {
                const data = await response.json();
                alert('Recept sikeresen feltöltve!');
                navigate('/mainlogin');
            } else {
                const error = await response.json();
                alert('Hiba történt: ' + (error.uzenet || 'Ismeretlen hiba'));
            }
        } catch (error) {
            console.error('Error uploading recipe:', error);
            alert('Hiba történt a feltöltés során');
        } finally {
            setLoading(false);
        }
    };

    return(
        <main>
            <div className="three uploadMargin">
                <div className="box">
                    <h1 className="title">Recept neve:</h1>
                    <input 
                        className="sideSelect" 
                        type="text" 
                        name="poszt_cim"
                        value={formData.poszt_cim}
                        onChange={handleInputChange}
                        placeholder="Recept neve" 
                    />
                </div>
                <div className="box">
                    <h1 className="title">Egyéb elnevezések:</h1>
                    <input 
                        className="sideSelect" 
                        type="text" 
                        name="alcimek"
                        value={formData.alcimek}
                        onChange={handleInputChange}
                        placeholder="pl. pityóka, burgonya (vesszővel elválasztva)" 
                    />
                </div>
                <div className="box">
                    <h1 className="title">Recept leírása:</h1>
                    <textarea 
                        className="sideSelect tall" 
                        name="poszt_leiras"
                        value={formData.poszt_leiras}
                        onChange={handleInputChange}
                        placeholder="Rövid leírás a recepthez"
                    ></textarea>
                </div>
                <div className="box">
                    <h1 className="title">Kép feltöltése:</h1>
                    <input 
                        className="sideSelect" 
                        type="file" 
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleImageChange}
                        style={{padding: '8px'}}
                        required
                    />
                    {imageFile && (
                        <p style={{marginTop: '8px', color: '#4CAF50', fontSize: '14px'}}>
                            Kiválasztva: {imageFile.name}
                        </p>
                    )}
                    <p style={{marginTop: '8px', fontSize: '12px', color: '#999'}}>
                        Támogatott formátumok: JPEG, PNG, GIF, WebP (max 5MB)
                    </p>
                </div>
            </div>

            <div className="three uploadMargin">
                <div className="box">
                    <h1 className="title">Hozzávalók:</h1>
                    {hozzavalok.map((hozzavalo, index) => (
                        <div key={index} style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap',marginBottom:8}}>
                            <input 
                                className="uploadInput" 
                                style={{flex:'1 1 120px',minWidth:0}} 
                                type="number" 
                                value={hozzavalo.mennyiseg}
                                onChange={(e) => handleHozzavaloChange(index, 'mennyiseg', e.target.value)}
                                placeholder="Mennyiség (pl. 200)" 
                            />
                            <input 
                                className="uploadInput" 
                                style={{flex:'1 1 120px',minWidth:0}} 
                                type="text" 
                                list={`mertekegyseg-list-${index}`}
                                value={hozzavalo.mertekegyseg_nev}
                                onChange={(e) => handleHozzavaloChange(index, 'mertekegyseg_nev', e.target.value)}
                                placeholder="Mértékegység" 
                            />
                            <datalist id={`mertekegyseg-list-${index}`}>
                                {mertekegysegOptions.map(m => (
                                    <option key={m.mertekegyseg_id} value={m.mertekegyseg_nev} />
                                ))}
                            </datalist>
                            <input 
                                className="uploadInput" 
                                style={{flex:'2 1 160px',minWidth:0}} 
                                type="text" 
                                value={hozzavalo.hozzavalo_nev}
                                onChange={(e) => handleHozzavaloChange(index, 'hozzavalo_nev', e.target.value)}
                                placeholder="Hozzávaló" 
                            />
                            <button 
                                className="deleteButton" 
                                style={{flex:'0 0 auto'}}
                                onClick={() => removeHozzavalo(index)}
                            >
                                Törlés
                            </button>
                        </div>
                    ))}
                    <div className="wrap">
                        <h2 className="subtitle">Hozzávaló hozzáadása: </h2>
                        <button className="button" onClick={addHozzavalo}>+</button>
                    </div>
                </div>
                <div className="box">
                    <h1 className="title">Lépések:</h1>
                    {lepesek.map((lepes, index) => (
                        <div key={index} style={{marginBottom:8}}>
                            <input 
                                className="uploadInput three" 
                                type="text" 
                                value={lepes}
                                onChange={(e) => handleLepesChange(index, e.target.value)}
                                placeholder={`${index + 1}. lépés`} 
                            />
                            <button 
                                className="deleteButton five"
                                onClick={() => removeLepes(index)}
                            >
                                Törlés
                            </button>
                        </div>
                    ))}
                    <div className="wrap">
                        <h2 className="subtitle">További lépés hozzáadása: </h2>
                        <button className="button" onClick={addLepes}>+</button>
                    </div>
                </div>
                <div className="box">
                    <h1 className="title">Preferenciák:</h1>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px'}}>
                        {preferenciaOptions.map(pref => (
                            <button
                                key={pref.preferencia_id}
                                type="button"
                                className={`sideButton ${selectedPreferences.includes(pref.preferencia_id) ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedPreferences(prev => 
                                        prev.includes(pref.preferencia_id)
                                            ? prev.filter(id => id !== pref.preferencia_id)
                                            : [...prev, pref.preferencia_id]
                                    );
                                }}
                                style={{flex: '0 0 auto'}}
                            >
                                {pref.preferencia_nev}
                            </button>
                        ))}
                    </div>
                </div>
                <button 
                    className="button" 
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Feltöltés...' : 'Feltöltés'}
                </button>
            </div>
            <div className="three uploadMargin">
                <div className="box">
                    <h1 className="title">Jellemzők:</h1>

                    <h2 className="subtitle">Konyha:</h2>
                    <select 
                        className="sideSelect"
                        name="konyha_id"
                        value={formData.konyha_id || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, konyha_id: parseInt(e.target.value) }))}
                    >
                        <option value="">Válassz...</option>
                        {konyhaOptions.map(k => (
                            <option key={k.konyha_id} value={k.konyha_id}>{k.konyha_nev}</option>
                        ))}
                    </select>

                    <h2 className="subtitle">Ár:</h2>
                    <div>
                        <button 
                            className={`sideButton five ${formData.ar_id === 1 ? 'active' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, ar_id: 1 }))}
                        >$</button>
                        <button 
                            className={`sideButton five ${formData.ar_id === 2 ? 'active' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, ar_id: 2 }))}
                        >$$</button>
                        <button 
                            className={`sideButton five ${formData.ar_id === 3 ? 'active' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, ar_id: 3 }))}
                        >$$$</button>
                    </div>

                    <h2 className="subtitle">Adag: </h2>
                    <div>
                        <input 
                            type="number" 
                            className="sideSelect" 
                            name="poszt_adag"
                            value={formData.poszt_adag}
                            onChange={handleInputChange}
                            placeholder="Adag" 
                        />
                    </div>

                    <h2 className="subtitle">Nehézség:</h2>
                    <div>
                        <button 
                            className={`sideButton five ${formData.nehezseg_id === 1 ? 'active' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, nehezseg_id: 1 }))}
                        >*</button>
                        <button 
                            className={`sideButton five ${formData.nehezseg_id === 2 ? 'active' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, nehezseg_id: 2 }))}
                        >**</button>
                        <button 
                            className={`sideButton five ${formData.nehezseg_id === 3 ? 'active' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, nehezseg_id: 3 }))}
                        >***</button>
                    </div>

                    <h2 className="subtitle">Elkészítési idő (perc):</h2>
                    <input 
                        type="number" 
                        name="poszt_ido"
                        value={formData.poszt_ido}
                        onChange={handleInputChange}
                        placeholder="Perc" 
                    />

                    <h2 className="subtitle">Fogás:</h2>
                    <select 
                        className="sideSelect"
                        name="fogas_id"
                        value={formData.fogas_id || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, fogas_id: parseInt(e.target.value) }))}
                    >
                        <option value="">Válassz...</option>
                        {fogasOptions.map(f => (
                            <option key={f.fogas_id} value={f.fogas_id}>{f.fogas_nev}</option>
                        ))}
                    </select>

                    <h2 className="subtitle">Szezon:</h2>
                    <select 
                        className="sideSelect"
                        name="szezon_id"
                        value={formData.szezon_id || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, szezon_id: parseInt(e.target.value) }))}
                    >
                        <option value="">Válassz...</option>
                        {szezonOptions.map(s => (
                            <option key={s.szezon_id} value={s.szezon_id}>{s.szezon_nev}</option>
                        ))}
                    </select>
                </div>
            </div>
        </main>
    )
}