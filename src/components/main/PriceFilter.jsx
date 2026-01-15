export default function PriceFilter({ price, setPrice }){
    return (
        <div>
            <h2 className="sideTitle">Ár:</h2>
            <div className="sideRow">
                <button 
                    className={`sideButton three x-large-font ${price==='olcsó'? 'active':''}`} 
                    onClick={() => setPrice(prev => prev==='olcsó'? null:'olcsó')}
                >
                    olcsó ($)
                </button>
                <button 
                    className={`sideButton three x-large-font ${price==='közepes'? 'active':''}`} 
                    onClick={() => setPrice(prev => prev==='közepes'? null:'közepes')}
                >
                    közepes ($$)
                </button>
                <button 
                    className={`sideButton three x-large-font ${price==='drága'? 'active':''}`} 
                    onClick={() => setPrice(prev => prev==='drága'? null:'drága')}
                >
                    drága ($$$)
                </button>
            </div>
        </div>
    );
}
