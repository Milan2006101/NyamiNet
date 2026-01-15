export default function TimeFilter({ timeRange, setTimeRange }){
    return (
        <div>
            <h2 className="sideTitle">Elkészítési idő:</h2>
            <div className="sideRow">
                <button 
                    className={`sideButton ${timeRange==='<30'? 'active':''}`} 
                    onClick={() => setTimeRange(prev=> prev==='<30'? '': '<30')}
                >
                    &lt; 30 perc
                </button>
                <button 
                    className={`sideButton ${timeRange==='30-60'? 'active':''}`} 
                    onClick={() => setTimeRange(prev=> prev==='30-60'? '': '30-60')}
                >
                    30-60 perc
                </button>
                <button 
                    className={`sideButton ${timeRange==='60-180'? 'active':''}`} 
                    onClick={() => setTimeRange(prev=> prev==='60-180'? '': '60-180')}
                >
                    1-3 óra
                </button>
                <button 
                    className={`sideButton ${timeRange==='>180'? 'active':''}`} 
                    onClick={() => setTimeRange(prev=> prev==='>180'? '': '>180')}
                >
                    3 óra &lt;
                </button>
            </div>
        </div>
    );
}
