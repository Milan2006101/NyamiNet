import NavLogo from './NavLogo.jsx';
import NavButtons from './NavButtons.jsx';
import UserButtons from './UserButtons.jsx';

export default function NavbarLogin({selected}){
    return(
        <div className="navbar">
            <NavLogo />
            <NavButtons selected={selected} />
            <UserButtons selected={selected} />
        </div>
    );
}
