const PREF_MAP = {
    '1': ['vegán'],
    '2': ['vegetáriánus'],
    '3': ['mogyoró mentes'],
    '4': ['laktóz mentes']
};

export const getSeasonFromMonth = (m) => {
    if ([11,0,1].includes(m)) return 'tél';
    if ([2,3,4].includes(m)) return 'tavasz';
    if ([5,6,7].includes(m)) return 'nyár';
    return 'ősz';
};

export const applyAllFilters = (originalReceptek, filters) => {
    const { price, konyha, timeRange, selectedPreferences, dateFilter, fogas, difficulty, season } = filters;
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

    return list;
};
