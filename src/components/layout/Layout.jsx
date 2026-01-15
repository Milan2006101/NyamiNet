import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import NavbarLogin from "../navbar/navbarLogin.jsx";
import NavbarNoLogin from "../navbar/navbarNoLogin.jsx";
import NavbarBack from "../navbar/navbarBack.jsx";
import Footer from "../navbar/footer.jsx";
import { usePagination } from "../../context/PaginationContext.jsx";

export default function Layout({ children }){
    const location = useLocation();
    const pathname = location.pathname;
    const { currentPage, totalPages, setCurrentPage, setTotalPages } = usePagination();
    
    useEffect(() => {
        const paginatedPages = ['/', '/mainlogin', '/saved'];
        if (!paginatedPages.includes(pathname)) {
            setTotalPages(1);
            setCurrentPage(1);
        }
    }, [pathname, setTotalPages, setCurrentPage]);
    
    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch(e) {
            return null;
        }
    })();

    const getNavbar = () => {
        if (['/login', '/register'].includes(pathname)) {
            return <NavbarBack />;
        }
        
        if (pathname === '/recipe') {
            return user ? <NavbarLogin /> : <NavbarBack />;
        }
        
        if (user && ['/mainlogin', '/saved', '/upload', '/profile', '/profile_admin'].includes(pathname)) {
            let selected = '';
            if (pathname === '/mainlogin') selected = 'fooldal';
            else if (pathname === '/saved') selected = 'mentett';
            else if (pathname === '/upload') selected = 'feltoltes';
            else if (pathname === '/profile' || pathname === '/profile_admin') selected = 'fiok';
            
            return <NavbarLogin selected={selected} />;
        }
        
        return <NavbarNoLogin />;
    };

    return (
        <>
            <header>
                {getNavbar()}
            </header>
            <main className={pathname === '/login' || pathname === '/register' ? 'center' : ''}>
                {children}
            </main>
            <footer className={(pathname === '/login' || pathname === '/register') ? 'footer' : ''}>
                <Footer 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                />
            </footer>
        </>
    );
}
