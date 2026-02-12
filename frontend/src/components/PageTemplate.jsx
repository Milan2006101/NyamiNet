import { useLocation } from 'react-router-dom';
import { createContext, useContext, useState } from 'react';
import NavbarNoLogin from './navbar/navbarNoLogin';
import NavbarLogin from './navbar/navbarLogin';
import NavbarBack from './navbar/navbarBack';
import Footer from './navbar/footer';
import './navbar/styles/footer.css';

export const FooterContext = createContext({
    setFooterProps: () => {}
});

export function useFooter() {
    return useContext(FooterContext);
}

export default function PageTemplate({ children }) {
    const location = useLocation();
    const [footerProps, setFooterProps] = useState({});
    
    const getNavbar = () => {
        const path = location.pathname;
        
        if (path === '/login' || path === '/register') {
            return <NavbarBack />;
        }
        
        if (path === '/mainlogin') {
            return <NavbarLogin selected="fooldal" />;
        }
        if (path === '/my-recipes') {
            return <NavbarLogin selected="fiok" />;
        }
        if (path === '/saved') {
            return <NavbarLogin selected="mentett" />;
        }
        if (path === '/upload') {
            return <NavbarLogin selected="feltoltes" />;
        }
        if (path === '/profile' || path === '/profile_admin') {
            return <NavbarLogin selected="fiok" />;
        }
        
        if (path === '/recipe') {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    return <NavbarLogin />;
                }
            } catch(e) {
                return <NavbarBack />;
            }
            return <NavbarBack />;
        }

        if (path.startsWith('/admin')) {
            return <NavbarLogin selected="fiok" />;
        }
        
        return <NavbarNoLogin />;
    };
    
    return (
        <FooterContext.Provider value={{ setFooterProps }}>
            <header>
                {getNavbar()}
            </header>
            {children}
            <footer className="footer">
                <Footer {...footerProps} />
            </footer>
        </FooterContext.Provider>
    );
}
