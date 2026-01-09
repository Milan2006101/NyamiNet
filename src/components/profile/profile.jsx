import NavbarLogin from "../navbar/navbarLogin.jsx"
import Footer from "../navbar/footer.jsx";
import SidebarProfile from "./sidebar.jsx";

export default function Profile(){

    return(
        <>
        <header>
            <NavbarLogin selected={"fiok"}/>
        </header>
        <main className="wrap">
            <div className="profileTitle">
                <div className="box profilebox">
                    <h1 className="profileTitle">Jelszó megváltoztatása:</h1>
                    Régi jelszó:
                    <input type="password" className="sideSelect profileInput"></input>
                    Új jelszó:
                    <input type="password" className="sideSelect profileInput"></input>
                    Új jelszó megerősítése:
                    <input type="password" className="sideSelect profileInput"></input>
                    <button className="button profileInput ">Mentés</button>
                </div>
                <div className="box profilebox">
                    <h1 className="profileTitle">Sötét mód:</h1>
                    <button className="button profileInput ">Világos</button>
                    <button className="button profileInput  dark">Sötét</button>
                </div>
            </div>
            <div className="inputfield right profileTitle">
                <div className="box profilebox">
                    <h1>Ételpreferenciák:</h1>
                    
                    <div>
                        <button className="preferenceButton veg">Vegán</button>
                        <button className="preferenceButton veg">Vegetáriánus</button>
                        <button className="preferenceButton nut">Mogyorók</button>
                    </div>

                    <div>
                        <button className="preferenceButton lactose">Laktóz</button>
                        <button className="preferenceButton gluten">Glutén</button>
                        <button className="preferenceButton sugar">Cukor</button>
                    </div>

                    <div>
                        <button className="preferenceButton fish">Hal</button>
                        <button className="preferenceButton soy">Szója</button>
                        <button className="preferenceButton egg">Tojás</button>
                    </div>

                    <div>
                        <button className="preferenceButton fish invisible">Hal</button>
                        <button className="preferenceButton wheat">Búza</button>
                        <button className="preferenceButton egg invisible">Tojás</button>
                    </div>

                </div>
            </div>
            
            <SidebarProfile />
        </main>
        <footer className="footer">
            <Footer />
        </footer>
        </>
    )
}