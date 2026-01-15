import SidebarProfile from "./sidebar.jsx";
import PasswordChange from "./PasswordChange.jsx";
import DarkModeToggle from "./DarkModeToggle.jsx";
import FoodPreferences from "./FoodPreferences.jsx";

export default function Profile(){
    return(
        <div className="wrap">
            <div className="profileTitle">
                <PasswordChange />
                <DarkModeToggle />
            </div>
            <div className="inputfield right profileTitle">
                <FoodPreferences />
            </div>
            <SidebarProfile />
        </div>
    );
}