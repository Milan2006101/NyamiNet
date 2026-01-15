export const getPriceLabel = (ar_val) => {
    if (!ar_val && ar_val !== 0) return '-';
    if (typeof ar_val === 'string'){
        const map = { 'olcsó':'$', 'közepes':'$$', 'drága':'$$$' };
        return `${ar_val} ${map[ar_val] ? `(${map[ar_val]})` : ''}`.trim();
    }
    const n = Number(ar_val) || 0;
    if (n <= 0) return '-';
    return '$'.repeat(Math.min(3, n));
};

export const getDifficultyLabel = (nehezseg) => {
    if (!nehezseg && nehezseg !== 0) return '-';
    const map = { 'könnyű': '*', 'közepes': '**', 'nehéz': '***' };
    if (typeof nehezseg === 'string') return map[nehezseg] || nehezseg;
    const n = Number(nehezseg) || 0;
    if (n <= 0) return '-';
    return '*'.repeat(Math.min(3, n));
};

export const getSeasonLabel = (datum) => {
    const getSeasonFromMonth = (m) => {
        if ([11,0,1].includes(m)) return 'tél';
        if ([2,3,4].includes(m)) return 'tavasz';
        if ([5,6,7].includes(m)) return 'nyár';
        return 'ősz';
    };

    try{
        const d = new Date(datum);
        if (isNaN(d)) return '';
        return getSeasonFromMonth(d.getMonth());
    }catch(e){ 
        return '';
    }
};
