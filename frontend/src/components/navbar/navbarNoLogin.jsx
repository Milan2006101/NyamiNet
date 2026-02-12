import NavbarLogo from './NavbarLogo';
import NavbarAuthButtons from './NavbarAuthButtons';
import './styles/navbar.css';

export default function NavbarNoLogin(){
    return(
        <div className="navbar">
            <NavbarLogo />
            <NavbarAuthButtons />
        </div>
    )
}



