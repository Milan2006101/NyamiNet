import { useState, useEffect } from "react";
import Recipes from "./recipes.jsx";
import NavbarNoLogin from "../navbar/navbarNoLogin.jsx";
import Sidebar from "./sidebar.jsx";
import Footer from "../navbar/footer.jsx";

export default function MainNoLogin(){
    const [receptek, setReceptek] = useState([]);
    const [originalReceptek, setOriginalReceptek] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 4;

    useEffect(() => {
        fetch('http://localhost:3001/poszt')
            .then((res) => res.json())
            .then((data) => { setReceptek(data); setOriginalReceptek(data); })
            .catch((err) => console.error('Failed to fetch recipes', err));
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [receptek]);

    return(
        <>
        <header>
            <NavbarNoLogin />
        </header>
        <main>
            <Recipes receptek={receptek} setReceptek={setReceptek} currentPage={currentPage} pageSize={PAGE_SIZE} />
            <Sidebar originalReceptek={originalReceptek} setReceptek={setReceptek} />
        </main>
        <footer>
            <Footer currentPage={currentPage} totalPages={Math.max(1, Math.ceil((receptek||[]).length / PAGE_SIZE))} onPageChange={setCurrentPage} />
        </footer>
        </>
    )
}