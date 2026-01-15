import { useState, useEffect } from "react";
import Recipes from "./recipes.jsx";
import Sidebar from "./sidebar.jsx";
import { usePagination } from "../../context/PaginationContext.jsx";

export default function MainSaved(){
    const [receptek, setReceptek] = useState([]);
    const [originalReceptek, setOriginalReceptek] = useState([]);
    const { currentPage, setCurrentPage, setTotalPages } = usePagination();
    const PAGE_SIZE = 4;

    useEffect(() => {
        fetch('http://localhost:3001/poszt')
            .then((res) => res.json())
            .then((data) => { setReceptek(data); setOriginalReceptek(data); })
            .catch((err) => console.error('Failed to fetch recipes', err));
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [receptek, setCurrentPage]);

    useEffect(() => {
        setTotalPages(Math.max(1, Math.ceil((receptek||[]).length / PAGE_SIZE)));
    }, [receptek, setTotalPages]);

    return(
        <>
            <Recipes receptek={receptek} setReceptek={setReceptek} currentPage={currentPage} pageSize={PAGE_SIZE} />
            <Sidebar originalReceptek={originalReceptek} setReceptek={setReceptek} />
        </>
    );
}