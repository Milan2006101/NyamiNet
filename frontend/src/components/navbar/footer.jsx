import './styles/navbar.css';

export default function Footer({ currentPage, totalPages, onPageChange }){
    const hasPagination = typeof currentPage === 'number' && typeof totalPages === 'number' && totalPages > 1;

    const makePages = () => {
        if (!hasPagination) return [];
        if (totalPages <= 7) return Array.from({length: totalPages}, (_,i) => i+1);

        const pagesSet = new Set();
        pagesSet.add(1);
        const start = Math.max(2, currentPage - 2);
        const end = Math.min(totalPages - 1, currentPage + 2);
        for (let p = start; p <= end; p++) pagesSet.add(p);
        pagesSet.add(totalPages);

        const sorted = Array.from(pagesSet).sort((a,b) => a - b);
        const out = [];
        let prev = null;
        for (const p of sorted){
            if (prev !== null && p - prev > 1) out.push('ellipsis');
            out.push(p);
            prev = p;
        }
        return out;
    };

    const pagesToShow = makePages();

    return(
        <div className="navbar" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:8}}>
            {hasPagination ? (
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <button className="btn" onClick={() => onPageChange && onPageChange(Math.max(1, currentPage-1))}>Előző</button>
                    {pagesToShow.map((p, idx) => {
                        if (p === 'ellipsis') return <span key={`e-${idx}`} style={{padding:'0 8px', color:'white'}}>...</span>;
                        return <button key={p} className={`btn ${p===currentPage? 'selected':''}`} onClick={() => onPageChange && onPageChange(p)}>{p}</button>
                    })}
                    <button className="btn" onClick={() => onPageChange && onPageChange(Math.min(totalPages, currentPage+1))}>Következő</button>
                </div>
            ) : null}
        </div>
    )
}
