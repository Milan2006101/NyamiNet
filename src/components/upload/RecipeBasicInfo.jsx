export default function RecipeBasicInfo(){
    return (
        <div className="three uploadMargin">
            <div className="box">
                <h1 className="title">Recept neve:</h1>
                <input className="sideSelect" type="text" placeholder="Recept neve" />
            </div>
            <div className="box">
                <h1 className="title">Recept leírása:</h1>
                <textarea 
                    className="sideSelect tall" 
                    type="text" 
                    placeholder="Rövid leírás a recepthez"
                />
            </div>
            <div className="box">
                <h1 className="title">Kép:</h1>
                <img />
                <button className="button">Fájl kiválasztása</button>
            </div>
        </div>
    );
}
