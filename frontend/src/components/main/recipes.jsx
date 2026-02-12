import Recipe from "./recipe.jsx";
import { useState, useEffect } from "react";
import './styles/recipes.css';

const API_BASE_URL = 'http://localhost:3001';

export default function Recipes({receptek = [], setReceptek, currentPage = 1, pageSize = 8, showDelete = false, onDelete, showSaveButton = false, isSavedPage = false, onRecipeUnsaved}){
    const [savedRecipeIds, setSavedRecipeIds] = useState(new Set());

    useEffect(() => {
        if (showSaveButton && !isSavedPage) {
            fetchSavedRecipes();
        } else if (isSavedPage) {
            const ids = new Set(receptek.map(r => r.poszt_id));
            setSavedRecipeIds(ids);
        }
    }, [showSaveButton, isSavedPage, receptek]);

    const fetchSavedRecipes = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/mentett`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const savedRecipes = await response.json();
                const ids = new Set(Array.isArray(savedRecipes) ? savedRecipes.map(r => r.poszt_id) : []);
                setSavedRecipeIds(ids);
            }
        } catch (err) {
            console.error('Failed to fetch saved recipes', err);
        }
    };

    const handleSaveToggle = async (posztId, isSaved) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Jelentkezz be a mentéshez!');
            return;
        }

        try {
            const method = isSaved ? 'DELETE' : 'POST';
            const response = await fetch(`${API_BASE_URL}/mentett/${posztId}`, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok || response.status === 409) {
                if (isSaved) {
                    setSavedRecipeIds(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(posztId);
                        return newSet;
                    });
                    if (isSavedPage && onRecipeUnsaved) {
                        onRecipeUnsaved();
                    }
                } else {
                    setSavedRecipeIds(prev => new Set(prev).add(posztId));
                }
            } else {
                console.error('Failed to toggle save status');
            }
        } catch (err) {
            console.error('Error toggling save:', err);
        }
    };

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
                        showDelete={showDelete}
                        onDelete={onDelete}
                        showSaveButton={showSaveButton}
                        isSaved={savedRecipeIds.has(recept.poszt_id)}
                        onSaveToggle={handleSaveToggle}
                    />
                )) : (
                    <div style={{padding:20}}><h3>Nincs megjeleníthető recept</h3></div>
                )}
            </div>
        </section>
    )
}