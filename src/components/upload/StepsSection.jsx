export default function StepsSection(){
    return (
        <div className="box">
            <h1 className="title">Lépések:</h1>
            <input 
                className="uploadInput three" 
                type="text" 
                placeholder="1. Első lépés" 
            />
            <button className="deleteButton five">Törlés</button>
            <div className="wrap">
                <h2 className="subtitle">További lépés hozzáadása: </h2>
                <button className="button">+</button>
            </div>
        </div>
    );
}
