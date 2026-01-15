export default function IngredientsSection(){
    return (
        <div className="box">
            <h1 className="title">Hozzávalók:</h1>
            <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                <input 
                    className="uploadInput" 
                    style={{flex:'1 1 120px',minWidth:0}} 
                    type="text" 
                    placeholder="Mennyiség (pl. 1)" 
                />
                <input 
                    className="uploadInput" 
                    style={{flex:'1 1 120px',minWidth:0}} 
                    type="text" 
                    placeholder="Mértékegység (pl. gramm)" 
                />
                <input 
                    className="uploadInput" 
                    style={{flex:'2 1 160px',minWidth:0}} 
                    type="text" 
                    placeholder="Hozzávaló (pl. só)" 
                />
                <button className="deleteButton" style={{flex:'0 0 auto'}}>
                    Törlés
                </button>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                <input 
                    className="uploadInput" 
                    style={{flex:'1 1 120px',minWidth:0}} 
                    type="text" 
                    placeholder="Mennyiség (pl. 1)" 
                />
                <input 
                    className="uploadInput" 
                    style={{flex:'1 1 120px',minWidth:0}} 
                    type="text" 
                    placeholder="Mértékegység (pl. gramm)" 
                />
                <input 
                    className="uploadInput" 
                    style={{flex:'2 1 160px',minWidth:0}} 
                    type="text" 
                    placeholder="Hozzávaló (pl. só)" 
                />
                <button className="deleteButton" style={{flex:'0 0 auto'}}>
                    Törlés
                </button>
            </div>
            <div className="wrap">
                <h2 className="subtitle">Hozzávaló hozzáadása: </h2>
                <button className="button">+</button>
            </div>
        </div>
    );
}
