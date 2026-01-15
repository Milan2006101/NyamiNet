export default function RecipeAttributes(){
    return (
        <div className="box">
            <h1 className="title">Jellemzők:</h1>
            <h2 className="subtitle">Kategória:</h2>
            <select className="sideSelect">
                <option value="">Válassz...</option>
            </select>

            <h2 className="subtitle">Konyha:</h2>
            <select className="sideSelect">
                <option value="">Válassz...</option>
            </select>

            <h2 className="subtitle">Ár:</h2>
            <div>
                <button className="sideButton five">$</button>
                <button className="sideButton five">$$</button>
                <button className="sideButton five">$$$</button>
            </div>

            <h2 className="subtitle">Adag: </h2>
            <div>
                <input type="number" className="sideSelect" placeholder="Adag" />
            </div>

            <h2 className="subtitle">Nehézség:</h2>
            <div>
                <button className="sideButton five">*</button>
                <button className="sideButton five">**</button>
                <button className="sideButton five">***</button>
            </div>

            <h2 className="subtitle">Elkészítési idő:</h2>
            <input type="number" placeholder="Perc" /> perc
            <br />
            <input type="number" placeholder="Óra" /> óra
            <br />
            <input type="number" placeholder="Nap" /> nap

            <h2 className="subtitle">Fogás:</h2>
            <select className="sideSelect">
                <option value="">Válassz...</option>
            </select>
        </div>
    );
}
