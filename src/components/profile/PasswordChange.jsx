export default function PasswordChange(){
    return (
        <div className="box profilebox">
            <h1 className="profileTitle">Jelszó megváltoztatása:</h1>
            Régi jelszó:
            <input type="password" className="sideSelect profileInput" />
            Új jelszó:
            <input type="password" className="sideSelect profileInput" />
            Új jelszó megerősítése:
            <input type="password" className="sideSelect profileInput" />
            <button className="button profileInput">Mentés</button>
        </div>
    );
}
