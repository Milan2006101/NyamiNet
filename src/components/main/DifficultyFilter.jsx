export default function DifficultyFilter({ difficulty, setDifficulty }){
    return (
        <div>
            <h2 className="sideTitle">Nehézség:</h2>
            <div className="sideRow">
                <button 
                    className={`sideButton three x-large-font ${difficulty==='könnyű'? 'active':''}`} 
                    onClick={()=>setDifficulty(prev=> prev==='könnyű'? null:'könnyű')}
                >
                    *
                </button>
                <button 
                    className={`sideButton three x-large-font ${difficulty==='közepes'? 'active':''}`} 
                    onClick={()=>setDifficulty(prev=> prev==='közepes'? null:'közepes')}
                >
                    **
                </button>
                <button 
                    className={`sideButton three x-large-font ${difficulty==='nehéz'? 'active':''}`} 
                    onClick={()=>setDifficulty(prev=> prev==='nehéz'? null:'nehéz')}
                >
                    ***
                </button>
            </div>
        </div>
    );
}
