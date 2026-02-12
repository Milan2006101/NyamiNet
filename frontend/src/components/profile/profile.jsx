import SidebarProfile from "./sidebar.jsx";
import SidebarAdmin from "./sidebar_admin.jsx";
import PasswordChange from "./PasswordChange.jsx";
import ThemeSelector from "./ThemeSelector.jsx";
import FoodPreferences from "./FoodPreferences.jsx";
import { getUser } from "../../utils/auth";
import './styles/profile.css';

export default function Profile(){
    const user = getUser();
    const isAdmin = user && user.role_id === 2;

    return(
        <main className="wrap">
            <div className="profileTitle">
                <PasswordChange />
                <ThemeSelector />
            </div>
            <div className="right profileTitle">
                <FoodPreferences />
            </div>
            {isAdmin ? <SidebarAdmin /> : <SidebarProfile />}
        </main>
    )
}