import { useState, useEffect } from "react";
import Recipes from "./recipes.jsx";
import Sidebar from "./sidebar.jsx";

const API_BASE_URL = 'http://localhost:3001';

export default function MainSaved(){
    const [receptek, setReceptek] = useState([]);

    const fetchReceptek = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            setReceptek([]);
            return;
        }

        fetch(`${API_BASE_URL}/mentett`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then((data) => setReceptek(Array.isArray(data) ? data : []))
            .catch((err) => {
                console.error('Failed to fetch saved recipes', err);
                setReceptek([]);
            });
    };

    useEffect(() => {
        fetchReceptek();
    }, []);

    return(
        <main>
            <Recipes receptek={receptek} setReceptek={setReceptek} showSaveButton={true} isSavedPage={true} onRecipeUnsaved={fetchReceptek} />
            <Sidebar onFilterChange={() => {}} />
        </main>
    )
}