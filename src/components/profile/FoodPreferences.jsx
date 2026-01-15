export default function FoodPreferences(){
    return (
        <div className="box profilebox">
            <h1>Ételpreferenciák:</h1>
            
            <div>
                <button className="preferenceButton veg">Vegán</button>
                <button className="preferenceButton veg">Vegetáriánus</button>
                <button className="preferenceButton nut">Mogyorók</button>
            </div>

            <div>
                <button className="preferenceButton lactose">Laktóz</button>
                <button className="preferenceButton gluten">Glutén</button>
                <button className="preferenceButton sugar">Cukor</button>
            </div>

            <div>
                <button className="preferenceButton fish">Hal</button>
                <button className="preferenceButton soy">Szója</button>
                <button className="preferenceButton egg">Tojás</button>
            </div>

            <div>
                <button className="preferenceButton fish invisible">Hal</button>
                <button className="preferenceButton wheat">Búza</button>
                <button className="preferenceButton egg invisible">Tojás</button>
            </div>
        </div>
    );
}
