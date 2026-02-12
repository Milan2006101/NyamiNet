import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001';

export default function ReportModal({ posztId, onClose }) {
    const [indoklasOptions, setIndoklasOptions] = useState([]);
    const [selectedIndoklas, setSelectedIndoklas] = useState(null);
    const [reportSzoveg, setReportSzoveg] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/indoklas`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log('Indoklas data received:', data);
                if (Array.isArray(data)) {
                    setIndoklasOptions(data);
                } else if (data && data.data && Array.isArray(data.data)) {
                    setIndoklasOptions(data.data);
                } else {
                    console.error('Unexpected data format:', data);
                }
            })
            .catch(err => {
                console.error('Error fetching indoklas options:', err);
                setIndoklasOptions([
                    { indoklas_id: 1, indoklas_szoveg: 'Sértő tartalom' },
                    { indoklas_id: 2, indoklas_szoveg: 'Spam / reklám' },
                    { indoklas_id: 3, indoklas_szoveg: 'Nem megfelelő kategória' }
                ]);
            });
    }, []);

    const handleSubmit = async () => {
        if (!selectedIndoklas) {
            alert('Válassz egy indoklást!');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Jelentkezz be a jelentéshez!');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/report`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    poszt_id: posztId,
                    indoklas_id: selectedIndoklas,
                    report_szoveg: reportSzoveg
                })
            });

            if (response.ok) {
                alert('Jelentés sikeresen elküldve!');
                onClose();
            } else {
                const err = await response.json();
                alert('Hiba: ' + (err.uzenet || 'Ismeretlen hiba'));
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('Hiba történt a jelentés küldése során');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}
        >
            <div 
                onClick={e => e.stopPropagation()}
                style={{
                    backgroundColor: 'var(--bg-modal)',
                    borderRadius: '15px',
                    padding: '30px',
                    width: '400px',
                    maxWidth: '90vw'
                }}
            >
                <h2 style={{ color: 'var(--text-accent-red)', marginTop: 0, marginBottom: '20px' }}>
                    Recept jelentése
                </h2>

                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>
                    Indoklás:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    {indoklasOptions.map(opt => (
                        <button
                            key={opt.indoklas_id}
                            type="button"
                            onClick={() => setSelectedIndoklas(opt.indoklas_id)}
                            style={{
                                padding: '10px 16px',
                                border: selectedIndoklas === opt.indoklas_id ? '2px solid var(--text-accent-red)' : '2px solid var(--border-color)',
                                borderRadius: '8px',
                                backgroundColor: selectedIndoklas === opt.indoklas_id ? '#BF3131' : 'var(--bg-input)',
                                color: selectedIndoklas === opt.indoklas_id ? 'white' : 'var(--text-primary)',
                                cursor: 'pointer',
                                fontWeight: selectedIndoklas === opt.indoklas_id ? 'bold' : 'normal',
                                fontSize: '14px',
                                textAlign: 'left'
                            }}
                        >
                            {opt.indoklas_szoveg}
                        </button>
                    ))}
                </div>

                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>
                    Megjegyzés (opcionális):
                </label>
                <textarea
                    value={reportSzoveg}
                    onChange={e => setReportSzoveg(e.target.value)}
                    placeholder="Írd le bővebben a problémát..."
                    style={{
                        width: '100%',
                        minHeight: '80px',
                        borderRadius: '8px',
                        border: '2px solid var(--border-color)',
                        padding: '10px',
                        fontSize: '14px',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                        marginBottom: '20px',
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--text-primary)'
                    }}
                />

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '10px 24px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Mégse
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            padding: '10px 24px',
                            backgroundColor: '#BF3131',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Küldés...' : 'Jelentés küldése'}
                    </button>
                </div>
            </div>
        </div>
    );
}
