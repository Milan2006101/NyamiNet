import { useLocation } from "react-router-dom";
import RecipeHeader from "./RecipeHeader.jsx";
import RecipeDetails from "./RecipeDetails.jsx";
import RecipePreferences from "./RecipePreferences.jsx";
import { getPriceLabel, getDifficultyLabel, getSeasonLabel } from "./recipeHelpers.js";

export default function RecipePage(){
    const location = useLocation();
    const recipe = location.state?.recipe;

    const user = (()=>{
        try{ 
            return JSON.parse(localStorage.getItem('user')); 
        }catch(e){ 
            return null; 
        }
    })();

    if(!recipe) return (
        <section style={{padding:20}}>
            <h2>Nincs kiválasztott recept</h2>
        </section>
    );

    const receptnev = recipe.poszt_cim || recipe.receptnev || '';
    const datum = recipe.poszt_datum || recipe.datum || '';
    const posztolo = recipe.felhasznalo_nev || recipe.posztolo || '';
    const leiras = recipe.poszt_leiras || recipe.leiras || '';
    const ar_val = recipe.ar_kategoria || recipe.ar || recipe.ar_id || null;
    const konyha = recipe.konyha_nev || recipe.konyha || '';
    const ido = recipe.poszt_ido || recipe.ido || '';
    const fogas = recipe.fogas_nev || recipe.fogas || '';
    const nehezseg = recipe.nehezseg_kategoria || recipe.nehezseg || null;
    const preferenciak = recipe.preferenciak || recipe.preferenciak || recipe.allergiak || [];

    const seasonLabel = getSeasonLabel(datum);
    const priceLabel = getPriceLabel(ar_val);
    const diffLabel = getDifficultyLabel(nehezseg);

    return (
        <section style={{padding:20}}>
            <RecipeHeader 
                receptnev={receptnev} 
                datum={datum} 
                posztolo={posztolo} 
            />
            
            <div style={{marginTop:12}}>
                <h3>Leírás</h3>
                <p>{leiras}</p>
            </div>

            <RecipeDetails 
                priceLabel={priceLabel}
                konyha={konyha}
                seasonLabel={seasonLabel}
                ido={ido}
                fogas={fogas}
                diffLabel={diffLabel}
            />

            <RecipePreferences preferenciak={preferenciak} />
        </section>
    );
}

