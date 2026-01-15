import Recipe from "./recipe.jsx";

export default function Recipes({receptek = [], setReceptek, currentPage = 1, pageSize = 8}){
    const total = receptek.length || 0;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = receptek.slice(start, end);

    return(
        <section className="recipesArea">
            <div>
                {pageItems.length ? pageItems.map((recept) => (
                    <Recipe
                        {...recept}
                        key={recept.poszt_id || recept.poszt_cim}
                    />
                )) : (
                    <div style={{padding:20}}><h3>Nincs megjeleníthető recept</h3></div>
                )}
            </div>
        </section>
    )
}