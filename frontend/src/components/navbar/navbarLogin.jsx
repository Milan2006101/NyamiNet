import NavbarLogo from './NavbarLogo';
import NavbarMainButtons from './NavbarMainButtons';
import NavbarUserActions from './NavbarUserActions';
import './styles/navbar.css';

export default function NavbarLogin({selected}){
    return(
        <div className="navbar">
            <NavbarLogo />
            <NavbarMainButtons selected={selected} />
            <NavbarUserActions selected={selected} />
        </div>
    )
}