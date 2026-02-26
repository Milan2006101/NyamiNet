import { useState } from 'react';
import SidebarProfile from "./sidebar.jsx";
import SidebarAdmin from "./sidebar_admin.jsx";
import PasswordChange from "./PasswordChange.jsx";
import ThemeSelector from "./ThemeSelector.jsx";
import FoodPreferences from "./FoodPreferences.jsx";
import { getUser } from "../../utils/auth";
import './styles/profile.css';
import '../main/styles/sidebar.css';

export default function Profile(){
    const user = getUser();
    const isAdmin = user && user.role_id === 2;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return(
        <main className="wrap">
            <div className="profileTitle">
                <PasswordChange />
                <ThemeSelector />
            </div>
            <div className="right profileTitle">
                <FoodPreferences />
            </div>
            <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>&raquo;</button>
            <div className={`sidebar-overlay ${sidebarOpen ? 'sidebar-overlay-visible' : ''}`} onClick={() => setSidebarOpen(false)} />
            {isAdmin
                ? <SidebarAdmin className={sidebarOpen ? 'sidebar-open' : ''} />
                : <SidebarProfile className={sidebarOpen ? 'sidebar-open' : ''} />
            }
        </main>
    )
}