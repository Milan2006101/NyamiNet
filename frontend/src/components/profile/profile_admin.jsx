import { useState } from 'react';
import SidebarAdmin from "./sidebar_admin.jsx";
import PasswordChange from "./PasswordChange.jsx";
import ThemeSelector from "./ThemeSelector.jsx";
import FoodPreferences from "./FoodPreferences.jsx";
import './styles/profile.css';
import '../main/styles/sidebar.css';

export default function ProfileAdmin(){
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return(
        <main className="wrap">
            <div className="profileTitle">
                <PasswordChange />
                <ThemeSelector />
            </div>
            <div className="inputfield right profileTitle">
                <FoodPreferences />
            </div>
            <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>&raquo;</button>
            <div className={`sidebar-overlay ${sidebarOpen ? 'sidebar-overlay-visible' : ''}`} onClick={() => setSidebarOpen(false)} />
            <SidebarAdmin className={sidebarOpen ? 'sidebar-open' : ''} />
        </main>
    )
}