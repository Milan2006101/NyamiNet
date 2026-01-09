import { useState, useEffect } from "react";
import Recipes from "./recipes.jsx";
import NavbarLogin from "../navbar/navbarLogin.jsx";
import Sidebar from "./sidebar.jsx";
import Footer from "../navbar/footer.jsx";

export default function MainSaved(){
    const [receptek, setReceptek] = useState([]);
    const [originalReceptek, setOriginalReceptek] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/poszt')
            .then((res) => res.json())
            .then((data) => { setReceptek(data); setOriginalReceptek(data); })
            .catch((err) => console.error('Failed to fetch recipes', err));
    }, []);

    return(
        <>
        <header>
            <NavbarLogin selected="mentett"/>
        </header>
        <main>
            <Recipes receptek={receptek} setReceptek={setReceptek} />
            <Sidebar originalReceptek={originalReceptek} setReceptek={setReceptek} />
        </main>
        <footer>
            <Footer />
        </footer>
        </>
    )
}