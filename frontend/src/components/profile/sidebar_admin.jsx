import { useNavigate } from 'react-router-dom';
import { getUser } from '../../utils/auth';
import './styles/profile.css';
import '../main/styles/sidebar.css';

export default function SidebarAdmin(){
    const navigate = useNavigate();
    const user = getUser();

    const handleMyRecipes = () => {
        if (user && user.felhasznalo_id) {
            navigate(`/my-recipes`);
        }
    };

    return(
        <div className="sidebar sidebar-profile">
            <div style={{cursor: 'pointer'}} onClick={() => navigate('/profile')}>
                <h2 className="sideTitle">Általános</h2>
                <div className="sideRow">
                </div>
            </div>
            <div style={{cursor: 'pointer'}} onClick={handleMyRecipes}>
                <h2 className="sideTitle">Saját receptek</h2>
                <div className="sideRow"></div>
            </div>
            <div style={{cursor: 'pointer'}} onClick={() => navigate('/admin/reports')}>
                <h2 className="sideTitle">Admin jogosultságok</h2>
            </div>
        </div>
    )
}