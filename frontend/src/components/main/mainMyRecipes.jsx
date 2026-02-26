import { useState, useEffect } from "react";
import Recipes from "./recipes.jsx";
import Sidebar from "./sidebar.jsx";
import { useFooter } from "../PageTemplate";
import { getUser, isAuthenticated } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = 'http://localhost:3001';

export default function MainMyRecipes(){
    const [allReceptek, setAllReceptek] = useState([]);
    const [receptek, setReceptek] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 4;
    const { setFooterProps } = useFooter();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        fetchMyRecipes();
    }, [navigate]);

    const fetchMyRecipes = (filterParams = new URLSearchParams()) => {
        const user = getUser();
        if (!user || !user.felhasznalo_nev) {
            console.error('No user logged in');
            return;
        }

        fetch(`${API_BASE_URL}/poszt?${filterParams.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                const myRecipes = data.filter(recipe => recipe.felhasznalo_nev === user.felhasznalo_nev);
                setAllReceptek(data);
                setReceptek(myRecipes);
            })
            .catch((err) => console.error('Failed to fetch my recipes', err));
    };

    const handleDelete = async (posztId) => {
        const user = getUser();
        if (!user || !user.felhasznalo_id) {
            alert('Nincs bejelentkezve!');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/poszt/${posztId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    felhasznalo_id: user.felhasznalo_id
                })
            });

            if (response.ok) {
                alert('Recept sikeresen törölve!');
                fetchMyRecipes();
            } else {
                const error = await response.json();
                alert(error.error || 'Hiba történt a törlés során');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Hiba történt a törlés során');
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [receptek]);

    useEffect(() => {
        setFooterProps({
            currentPage,
            totalPages: Math.max(1, Math.ceil((receptek || []).length / PAGE_SIZE)),
            onPageChange: setCurrentPage
        });
        return () => setFooterProps({});
    }, [currentPage, receptek, setFooterProps]);

    return(
        <main>
            <Recipes 
                receptek={receptek} 
                setReceptek={setReceptek} 
                currentPage={currentPage} 
                pageSize={PAGE_SIZE}
                showDelete={true}
                onDelete={handleDelete}
            />
            <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>&raquo;</button>
            <div className={`sidebar-overlay ${sidebarOpen ? 'sidebar-overlay-visible' : ''}`} onClick={() => setSidebarOpen(false)} />
            <Sidebar className={sidebarOpen ? 'sidebar-open' : ''} onFilterChange={(params) => { 
                fetchMyRecipes(params);
                setCurrentPage(1); 
            }} />
        </main>
    )
}
