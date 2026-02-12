import './styles/sidebar.css';

export default function DifficultyFilter({ difficulty, setDifficulty }) {
    return (
        <div>
            <h2 className="sideTitle">Nehézség:</h2>
            <div className="sideRow">
                <button 
                    className={`sideButton x-large-font ${difficulty==='könnyű'? 'active':''}`} 
                    style={{flex: '1 1 0'}}
                    onClick={()=>setDifficulty(prev=> prev==='könnyű'? null:'könnyű')}
                >
                    *
                </button>
                <button 
                    className={`sideButton x-large-font ${difficulty==='közepes'? 'active':''}`} 
                    style={{flex: '1 1 0'}}
                    onClick={()=>setDifficulty(prev=> prev==='közepes'? null:'közepes')}
                >
                    **
                </button>
                <button 
                    className={`sideButton x-large-font ${difficulty==='nehéz'? 'active':''}`} 
                    style={{flex: '1 1 0'}}
                    onClick={()=>setDifficulty(prev=> prev==='nehéz'? null:'nehéz')}
                >
                    ***
                </button>
            </div>
        </div>
    );
}
