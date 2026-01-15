export default function RecipeHeader({ receptnev, datum, posztolo }){
    return (
        <>
            <h1>{receptnev}</h1>
            <h4>Posztolva: {datum} — Posztoló: {posztolo}</h4>
        </>
    );
}
