import { useState, useEffect } from "react";
import Recipes from "./recipes.jsx";
import Sidebar from "./sidebar.jsx";

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
            <Recipes receptek={receptek} setReceptek={setReceptek} />
            <Sidebar originalReceptek={originalReceptek} setReceptek={setReceptek} />
        </>
    );
}