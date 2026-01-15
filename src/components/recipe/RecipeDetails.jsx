export default function RecipeDetails({ priceLabel, konyha, seasonLabel, ido, fogas, diffLabel }){
    return (
        <div style={{marginTop:12}}>
            <h3>Adatok</h3>
            <p>Ár: {priceLabel}</p>
            <p>Konyha: {konyha}</p>
            {seasonLabel ? <p>Szezonalitás: {seasonLabel}</p> : null}
            <p>Elkészítési idő: {ido}p</p>
            <p>Fogás: {fogas}</p>
            <p>Nehézség: {diffLabel}</p>
        </div>
    );
}
