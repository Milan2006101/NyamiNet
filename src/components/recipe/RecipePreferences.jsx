export default function RecipePreferences({ preferenciak }){
    if (!Array.isArray(preferenciak) || !preferenciak.length) return null;

    const getPreferenceClass = (p) => {
        const l = (p||'').toLowerCase();
        if (l.includes('vegán') || l.includes('vegetári')) return 'veg';
        if (l.includes('mogyor')) return 'nut';
        if (l.includes('laktóz')) return 'lactose';
        if (l.includes('glut')) return 'gluten';
        if (l.includes('cukor')) return 'sugar';
        if (l.includes('hal')) return 'fish';
        if (l.includes('szója') || l.includes('szoja')) return 'soy';
        if (l.includes('tojás') || l.includes('tojas')) return 'egg';
        if (l.includes('búza') || l.includes('buza')) return 'wheat';
        return '';
    };

    return (
        <div style={{marginTop:12}}>
            <h3>Preferenciák</h3>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {preferenciak.map((p,i) => (
                    <span 
                        key={i} 
                        className={`preferenceBadge ${getPreferenceClass(p)}`.trim()}
                    >
                        {p}
                    </span>
                ))}
            </div>
        </div>
    );
}
