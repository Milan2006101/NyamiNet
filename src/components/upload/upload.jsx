import NavbarLogin from "../navbar/navbarLogin.jsx"
import Footer from "../navbar/footer.jsx";

export default function Upload(){

    return(
        <>
        <header>
            <NavbarLogin selected={"feltoltes"}/>
        </header>
        <main>
            <div className="three uploadMargin">
                <div className="box">
                    <h1 className="title">Recept neve:</h1>
                    <input className="sideSelect" type="text" placeholder="Recept neve" />
                </div>
                <div className="box">
                    <h1 className="title">Recept leírása:</h1>
                    <textarea className="sideSelect tall" type="text" placeholder="Rövid leírás a recepthez"></textarea>
                </div>
                <div className="box">
                    <h1 className="title">Kép:</h1>
                    <img />
                    <button className="button">Fájl kiválasztása</button>
                </div>
            </div>

            <div className="three uploadMargin">
                <div className="box">
                    <h1 className="title">Hozzávalók:</h1>
                    <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                        <input className="uploadInput" style={{flex:'1 1 120px',minWidth:0}} type="text" placeholder="Mennyiség (pl. 1)" />
                        <input className="uploadInput" style={{flex:'1 1 120px',minWidth:0}} type="text" placeholder="Mértékegység (pl. gramm)" />
                        <input className="uploadInput" style={{flex:'2 1 160px',minWidth:0}} type="text" placeholder="Hozzávaló (pl. só)" />
                        <button className="deleteButton" style={{flex:'0 0 auto'}}>Törlés</button>
                    </div>
                    <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                        <input className="uploadInput" style={{flex:'1 1 120px',minWidth:0}} type="text" placeholder="Mennyiség (pl. 1)" />
                        <input className="uploadInput" style={{flex:'1 1 120px',minWidth:0}} type="text" placeholder="Mértékegység (pl. gramm)" />
                        <input className="uploadInput" style={{flex:'2 1 160px',minWidth:0}} type="text" placeholder="Hozzávaló (pl. só)" />
                        <button className="deleteButton" style={{flex:'0 0 auto'}}>Törlés</button>
                    </div>
                    <div className="wrap">
                        <h2 className="subtitle">Hozzávaló hozzáadása: </h2>
                        <button className="button">+</button>
                    </div>
                </div>
                <div className="box">
                    <h1 className="title">Lépések:</h1>
                    <input className="uploadInput three" type="text" placeholder="1. Első lépés" />
                    <button className="deleteButton five">Törlés</button>
                    <div className="wrap">
                        <h2 className="subtitle">További lépés hozzáadása: </h2>
                        <button className="button">+</button>
                    </div>
                </div>
                <button className="button">Feltöltés</button>
            </div>
            <div className="three uploadMargin">
                <div className="box">
                    <h1 className="title">Jellemzők:</h1>
                    <h2 className="subtitle">Kategória:</h2>
                    <select className="sideSelect"><option value="">Válassz...</option></select>

                    <h2 className="subtitle">Konyha:</h2>
                    <select className="sideSelect"><option value="">Válassz...</option></select>

                    <h2 className="subtitle">Ár:</h2>
                    <div>
                        <button className="sideButton five">$</button>
                        <button className="sideButton five">$$</button>
                        <button className="sideButton five">$$$</button>
                    </div>

                    <h2 className="subtitle">Adag: </h2>
                    <div>
                    <input type="number" className="sideSelect" placeholder="Adag" />
                    </div>

                    <h2 className="subtitle">Nehézség:</h2>
                    <div>
                        <button className="sideButton five">*</button>
                        <button className="sideButton five">**</button>
                        <button className="sideButton five">***</button>
                    </div>

                    <h2 className="subtitle">Elkészítési idő:</h2>
                        <input type="number" placeholder="Perc" /> perc
                        <br />
                        <input type="number" placeholder="Óra" /> óra
                        <br />
                        <input type="number" placeholder="Nap" /> nap

                    <h2 className="subtitle">Fogás:</h2>
                    <select className="sideSelect"><option value="">Válassz...</option></select>
                </div>
            </div>
        </main>
        <footer className="footer">
            <Footer />
        </footer>
        </>
    )
}