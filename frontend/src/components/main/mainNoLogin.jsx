import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Recipes from "./recipes.jsx";
import Sidebar from "./sidebar.jsx";
import { useFooter } from "../PageTemplate";

const API_BASE_URL = 'http://localhost:3001';

export default function MainNoLogin(){
    const [receptek, setReceptek] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 4;
    const { setFooterProps } = useFooter();
    const location = useLocation();
    const [activeFilters, setActiveFilters] = useState(new URLSearchParams());

    const fetchReceptek = (sidebarFilters = new URLSearchParams()) => {
        const params = new URLSearchParams(sidebarFilters);
        const urlParams = new URLSearchParams(location.search);
        const searchQuery = urlParams.get('search');
        
        if (searchQuery) {
            params.set('search', searchQuery);
        }
        
        fetch(`${API_BASE_URL}/poszt?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => setReceptek(data))
            .catch((err) => console.error('Failed to fetch recipes', err));
    };

    useEffect(() => {
        fetchReceptek(activeFilters);
    }, [location.search]);

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
            <Recipes receptek={receptek} setReceptek={setReceptek} currentPage={currentPage} pageSize={PAGE_SIZE} />
            <Sidebar onFilterChange={(params) => { setActiveFilters(params); fetchReceptek(params); setCurrentPage(1); }} />
        </main>
    )
}