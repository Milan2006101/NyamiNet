import RecipeBasicInfo from "./RecipeBasicInfo.jsx";
import IngredientsSection from "./IngredientsSection.jsx";
import StepsSection from "./StepsSection.jsx";
import RecipeAttributes from "./RecipeAttributes.jsx";

export default function Upload(){
    return (
        <>
            <RecipeBasicInfo />

            <div className="three uploadMargin">
                <IngredientsSection />
                <StepsSection />
                <button className="button">Feltöltés</button>
            </div>

            <div className="three uploadMargin">
                <RecipeAttributes />
            </div>
        </>
    );
}
