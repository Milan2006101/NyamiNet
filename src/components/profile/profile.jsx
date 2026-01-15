import SidebarProfile from "./sidebar.jsx";
import PasswordChange from "./PasswordChange.jsx";
import DarkModeToggle from "./DarkModeToggle.jsx";
import FoodPreferences from "./FoodPreferences.jsx";

export default function Profile(){
    return(
        <>
            <div style={{flex: '1 1 auto', padding: '12px'}}>
                <div className="wrap">
                    <div className="profileTitle">
                        <PasswordChange />
                        <DarkModeToggle />
                    </div>
                    <div className="profileTitle">
                        <FoodPreferences />
                    </div>
                </div>
            </div>
            <SidebarProfile />
        </>
    );
}