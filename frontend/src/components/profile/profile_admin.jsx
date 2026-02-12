import SidebarAdmin from "./sidebar_admin.jsx";
import PasswordChange from "./PasswordChange.jsx";
import ThemeSelector from "./ThemeSelector.jsx";
import FoodPreferences from "./FoodPreferences.jsx";
import './styles/profile.css';

export default function ProfileAdmin(){
    return(
        <main className="wrap">
            <div className="profileTitle">
                <PasswordChange />
                <ThemeSelector />
            </div>
            <div className="inputfield right profileTitle">
                <FoodPreferences />
            </div>
            <SidebarAdmin />
        </main>
    )
}