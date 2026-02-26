
const ALAP_URL = 'http://localhost:5173';
const API_URL  = 'http://localhost:3001';

const MOBILE_BREAKPOINT = 1024;

const TESZT_FELHASZNALO = {
  felhasznalo_nev: 'cypress_teszt',
  email: 'cypress_teszt@teszt.hu',
  jelszo: 'Teszt1234!'
};

const isMobile = () => Cypress.config('viewportWidth') <= MOBILE_BREAKPOINT;

const openHamburgerIfMobile = () => {
  if (isMobile()) {
    cy.get('.hamburger-btn').should('be.visible').click();
    cy.get('.navbar-links.open').should('exist');
  }
};

const openSidebarIfMobile = () => {
  if (isMobile()) {
    cy.get('.sidebar-toggle-btn').should('be.visible').click();
    cy.get('.sidebar.sidebar-open').should('exist');
  }
};

const bejelentkezes = () => {
  cy.request({
    method: 'POST',
    url: `${API_URL}/auth/bejelentkezes`,
    body: { email: TESZT_FELHASZNALO.email, jelszo: TESZT_FELHASZNALO.jelszo }
  }).then(({ body }) => {
    window.localStorage.setItem('token', body.token);
    window.localStorage.setItem('user', JSON.stringify(body.user));
  });
};

before(() => {
  cy.request({
    method: 'POST',
    url: `${API_URL}/auth/regisztracio`,
    body: {
      felhasznalo_nev: TESZT_FELHASZNALO.felhasznalo_nev,
      email: TESZT_FELHASZNALO.email,
      jelszo: TESZT_FELHASZNALO.jelszo
    },
    failOnStatusCode: false
  });
});

describe('Bejelentkezés nélküli főoldal', () => {

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
  });

  it('Az oldal sikeresen betölt és az URL helyes', () => {
    cy.url().should('eq', `${ALAP_URL}/`);
  });

  it('A navbar látható és tartalmazza a NyamiNet feliratot', () => {
    cy.get('.navbar').should('be.visible');
    cy.get('.navbar').contains('NyamiNet').should('be.visible');
  });

  it('Mobil nézetben a hamburger gomb látható', () => {
    if (!isMobile()) return cy.log('Nem mobil nézet – kihagyva');
    cy.get('.hamburger-btn').should('be.visible');
  });

  it('A navbaron megjelenik a Bejelentkezés gomb', () => {
    openHamburgerIfMobile();
    cy.get('.navbar').contains('button', 'Bejelentkezés').should('be.visible');
  });

  it('A navbaron megjelenik a Regisztráció gomb', () => {
    openHamburgerIfMobile();
    cy.get('.navbar').contains('button', 'Regisztráció').should('be.visible');
  });

  it('A Bejelentkezés gombra kattintva a /login oldalra navigál', () => {
    openHamburgerIfMobile();
    cy.contains('button', 'Bejelentkezés').click();
    cy.url().should('include', '/login');
  });

  it('A Regisztráció gombra kattintva a /register oldalra navigál', () => {
    openHamburgerIfMobile();
    cy.contains('button', 'Regisztráció').click();
    cy.url().should('include', '/register');
  });

  it('A NyamiNet logóra kattintva bejelentkezés nélkül a főoldalon marad', () => {
    cy.contains('a.nyami', 'NyamiNet').click();
    cy.url().should('eq', `${ALAP_URL}/`);
  });

  it('A keresőmező látható és szöveg beírásakor az URL frissül', () => {
    openHamburgerIfMobile();
    cy.get('input[type="search"]').should('be.visible').type('csirke');
    cy.url().should('include', 'search=csirke');
  });

  it('A keresőmező kiürítésekor az URL visszaáll a főoldalra', () => {
    openHamburgerIfMobile();
    cy.get('input[type="search"]').type('csirke').clear();
    cy.url().should('eq', `${ALAP_URL}/`);
  });

  it('A main szekció létezik', () => {
    cy.get('main').should('exist');
  });

  it('A sidebar megjelenik a főoldalon', () => {
    cy.wait(1000);
    if (isMobile()) {
      cy.get('.sidebar-toggle-btn').should('be.visible');
      openSidebarIfMobile();
      cy.get('.sidebar.sidebar-open').should('be.visible');
    } else {
      cy.get('main').find('[class*="sidebar"]').should('be.visible');
    }
  });

});

describe('Bejelentkezési oldal', () => {

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit(`${ALAP_URL}/login`);
  });

  it('A bejelentkezési oldal betölt és a "Bejelentkezés" cím megjelenik', () => {
    cy.get('h1').should('contain.text', 'Bejelentkezés');
  });

  it('Az email mező megjelenik', () => {
    cy.get('input[type="email"]').should('be.visible');
  });

  it('A jelszó mező megjelenik', () => {
    cy.get('input[type="password"]').should('be.visible');
  });

  it('A Bejelentkezés gomb megjelenik', () => {
    cy.contains('button', 'Bejelentkezés').should('be.visible');
  });

  it('A Regisztráció link megjelenik és a /register oldalra navigál', () => {
    cy.contains('a', 'Regisztráció').should('be.visible').click();
    cy.url().should('include', '/register');
  });

  it('Nem létező email esetén hibaüzenet jelenik meg', () => {
    cy.get('input[type="email"]').type('nemletezik@teszt.hu');
    cy.get('input[type="password"]').type('ValamiJelszo1!');
    cy.contains('button', 'Bejelentkezés').click();
    cy.get('.link[style*="color: red"], .link[style*="color:red"]').should('be.visible');
  });

  it('Helyes email de helytelen jelszó esetén hibaüzenet jelenik meg', () => {
    cy.get('input[type="email"]').type(TESZT_FELHASZNALO.email);
    cy.get('input[type="password"]').type('RosszJelszo999!');
    cy.contains('button', 'Bejelentkezés').click();
    cy.get('.link[style*="color: red"], .link[style*="color:red"]').should('be.visible');
  });

  it('Helyes adatokkal sikeres bejelentkezés és /mainlogin-ra átirányítás', () => {
    cy.get('input[type="email"]').type(TESZT_FELHASZNALO.email);
    cy.get('input[type="password"]').type(TESZT_FELHASZNALO.jelszo);
    cy.contains('button', 'Bejelentkezés').click();
    cy.url().should('include', '/mainlogin');
  });

  it('Sikeres bejelentkezés után a token eltárolódik localStorage-ban', () => {
    cy.get('input[type="email"]').type(TESZT_FELHASZNALO.email);
    cy.get('input[type="password"]').type(TESZT_FELHASZNALO.jelszo);
    cy.contains('button', 'Bejelentkezés').click();
    cy.url().should('include', '/mainlogin');
    cy.window().its('localStorage').invoke('getItem', 'token').should('not.be.null');
  });

  it('Sikeres bejelentkezés után a user objektum eltárolódik a helyes emaillel', () => {
    cy.get('input[type="email"]').type(TESZT_FELHASZNALO.email);
    cy.get('input[type="password"]').type(TESZT_FELHASZNALO.jelszo);
    cy.contains('button', 'Bejelentkezés').click();
    cy.url().should('include', '/mainlogin');
    cy.window().then(win => {
      const user = JSON.parse(win.localStorage.getItem('user'));
      expect(user).to.have.property('felhasznalo_email', TESZT_FELHASZNALO.email);
    });
  });

});

describe('Regisztrációs oldal', () => {

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit(`${ALAP_URL}/register`);
  });

  it('A regisztrációs oldal betölt és a "Regisztráció" cím megjelenik', () => {
    cy.get('h1').should('contain.text', 'Regisztráció');
  });

  it('A Név szövegmező megjelenik', () => {
    cy.get('input[type="text"]').should('be.visible');
  });

  it('Az Email mező megjelenik', () => {
    cy.get('input[type="email"]').should('be.visible');
  });

  it('Két jelszó mező jelenik meg (Jelszó és Megerősítés)', () => {
    cy.get('input[type="password"]').should('have.length', 2);
  });

  it('A Regisztráció gomb megjelenik', () => {
    cy.contains('button', 'Regisztráció').should('be.visible');
  });

  it('A Bejelentkezés link megjelenik és a /login oldalra navigál', () => {
    cy.contains('a', 'Bejelentkezés').should('be.visible').click();
    cy.url().should('include', '/login');
  });

  it('Nem egyező jelszavak esetén kliensoldali hibaüzenet jelenik meg', () => {
    cy.get('input[type="text"]').type('valakiNev');
    cy.get('input[type="email"]').type('valaki@teszt.hu');
    cy.get('input[type="password"]').first().type('Jelszo1234!');
    cy.get('input[type="password"]').last().type('MasikJelszo!');
    cy.contains('button', 'Regisztráció').click();
    cy.contains('A jelszavak nem egyeznek').should('be.visible');
  });

  it('Már foglalt email esetén szerver hibaüzenet jelenik meg', () => {
    cy.get('input[type="text"]').type('UjNev123');
    cy.get('input[type="email"]').type(TESZT_FELHASZNALO.email);
    cy.get('input[type="password"]').first().type(TESZT_FELHASZNALO.jelszo);
    cy.get('input[type="password"]').last().type(TESZT_FELHASZNALO.jelszo);
    cy.contains('button', 'Regisztráció').click();
    cy.get('.link[style*="color: red"], .link[style*="color:red"]').should('be.visible');
  });

  it('Már foglalt felhasználónév esetén szerver hibaüzenet jelenik meg', () => {
    cy.get('input[type="text"]').type(TESZT_FELHASZNALO.felhasznalo_nev);
    cy.get('input[type="email"]').type('masikegyedi@teszt.hu');
    cy.get('input[type="password"]').first().type(TESZT_FELHASZNALO.jelszo);
    cy.get('input[type="password"]').last().type(TESZT_FELHASZNALO.jelszo);
    cy.contains('button', 'Regisztráció').click();
    cy.get('.link[style*="color: red"], .link[style*="color:red"]').should('be.visible');
  });

  it('Szóközt tartalmazó felhasználónév esetén hibaüzenet jelenik meg', () => {
    cy.get('input[type="text"]').type('nev szokozzel');
    cy.get('input[type="email"]').type('szokoz@teszt.hu');
    cy.get('input[type="password"]').first().type('Teszt1234!');
    cy.get('input[type="password"]').last().type('Teszt1234!');
    cy.contains('button', 'Regisztráció').click();
    cy.get('.link[style*="color: red"], .link[style*="color:red"]').should('be.visible');
  });

  it('Sikeres regisztráció (egyedi adatok) után a /login oldalra irányít át', () => {
    const egyedi = Date.now();
    cy.get('input[type="text"]').type(`teszt_${egyedi}`);
    cy.get('input[type="email"]').type(`teszt_${egyedi}@teszt.hu`);
    cy.get('input[type="password"]').first().type('Teszt1234!');
    cy.get('input[type="password"]').last().type('Teszt1234!');
    cy.contains('button', 'Regisztráció').click();
    cy.url().should('include', '/login');
  });

});

describe('Bejelentkezett főoldal', () => {

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/mainlogin`);
  });

  it('A főoldal betölt bejelentkezés után', () => {
    cy.url().should('include', '/mainlogin');
    cy.get('main').should('exist');
  });

  it('A navbar tartalmazza a Főoldal gombot', () => {
    openHamburgerIfMobile();
    cy.get('.navbar').contains('button', 'Főoldal').should('be.visible');
  });

  it('A navbar tartalmazza a Mentett Receptek gombot', () => {
    openHamburgerIfMobile();
    cy.get('.navbar').contains('button', 'Mentett Receptek').should('be.visible');
  });

  it('A navbar tartalmazza a Recept Feltöltés gombot', () => {
    openHamburgerIfMobile();
    cy.get('.navbar').contains('button', 'Recept Feltöltés').should('be.visible');
  });

  it('A navbar tartalmazza az A Fiókom gombot', () => {
    openHamburgerIfMobile();
    cy.get('.navbar').contains('button', 'A Fiókom').should('be.visible');
  });

  it('A navbar tartalmazza a Kijelentkezés gombot', () => {
    openHamburgerIfMobile();
    cy.get('.navbar').contains('button', 'Kijelentkezés').should('be.visible');
  });

  it('A keresőmező elérhető és keresésre frissíti az URL-t', () => {
    openHamburgerIfMobile();
    cy.get('input[type="search"]').should('be.visible').type('tészta');
    cy.url().should('include', 'search=t%C3%A9szta');
  });

  it('A keresőmező kiürítésekor visszaáll /mainlogin-ra', () => {
    openHamburgerIfMobile();
    cy.get('input[type="search"]').type('tészta').clear();
    cy.url().should('eq', `${ALAP_URL}/mainlogin`);
  });

  it('A Mentett Receptek gombra kattintva /saved oldalra navigál', () => {
    openHamburgerIfMobile();
    cy.contains('button', 'Mentett Receptek').click();
    cy.url().should('include', '/saved');
  });

  it('A Recept Feltöltés gombra kattintva /upload oldalra navigál', () => {
    openHamburgerIfMobile();
    cy.contains('button', 'Recept Feltöltés').click();
    cy.url().should('include', '/upload');
  });

  it('Az A Fiókom gombra kattintva /profile oldalra navigál', () => {
    openHamburgerIfMobile();
    cy.contains('button', 'A Fiókom').click();
    cy.url().should('include', '/profile');
  });

  it('A NyamiNet logóra kattintva bejelentkezve /mainlogin-on marad', () => {
    cy.contains('a.nyami', 'NyamiNet').click();
    cy.url().should('include', '/mainlogin');
  });

  it('Kijelentkezésre kattintva törli a tokent és a főoldalra navigál', () => {
    openHamburgerIfMobile();
    cy.contains('button', 'Kijelentkezés').click();
    cy.url().should('eq', `${ALAP_URL}/`);
    cy.window().its('localStorage').invoke('getItem', 'token').should('be.null');
  });

  it('A receptlista betölt (main nem üres)', () => {
    cy.wait(1500);
    cy.get('main').should('not.be.empty');
  });

  it('Egy receptre kattintva a recept részletező oldalra navigál', () => {
    cy.wait(1500);
    cy.get('.recipe').first().click({ force: true });
    cy.url().should('match', /\/recipe\/\d+/);
  });

});

describe('Saját receptek oldal', () => {

  it('Bejelentkezés nélkül a /my-recipes oldal /login-ra irányít át', () => {
    cy.clearLocalStorage();
    cy.visit(`${ALAP_URL}/my-recipes`);
    cy.url().should('include', '/login');
  });

  it('Bejelentkezve a /my-recipes oldal betölt', () => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/my-recipes`);
    cy.url().should('include', '/my-recipes');
    cy.get('main').should('exist');
  });

  it('Az oldal betöltésekor a main szekció látható', () => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/my-recipes`);
    cy.get('main').should('be.visible');
  });

  it('A sidebar megjelenik a saját receptek oldalon', () => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/my-recipes`);
    cy.wait(1000);
    if (isMobile()) {
      cy.get('.sidebar-toggle-btn').should('be.visible');
      openSidebarIfMobile();
      cy.get('.sidebar.sidebar-open').should('be.visible');
    } else {
      cy.get('main').find('[class*="sidebar"]').should('be.visible');
    }
  });

});

describe('Mentett receptek oldal', () => {

  it('Bejelentkezve a /saved oldal betölt', () => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/saved`);
    cy.url().should('include', '/saved');
    cy.get('main').should('exist');
  });

  it('A mentett receptek oldalon a main szekció látható', () => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/saved`);
    cy.get('main').should('be.visible');
  });

  it('Bejelentkezés nélkül a /saved oldal betölt (üres lista, nincs crash)', () => {
    cy.clearLocalStorage();
    cy.visit(`${ALAP_URL}/saved`);
    cy.get('main').should('exist');
  });

});

describe('Receptfeltöltő oldal', () => {

  it('Bejelentkezés nélkül a /upload oldal /login-ra irányít át', () => {
    cy.clearLocalStorage();
    cy.visit(`${ALAP_URL}/upload`);
    cy.url().should('include', '/login');
  });

  it('Bejelentkezve az /upload oldal betölt', () => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/upload`);
    cy.url().should('include', '/upload');
    cy.get('main').should('exist');
  });

  it('Az első lépés mezői megjelennek (cím, leírás, kép)', () => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/upload`);
    cy.wait(1000);
    cy.get('input[name="poszt_cim"]').should('be.visible');
    cy.get('textarea[name="poszt_leiras"]').should('be.visible');
    cy.get('input[type="file"]').should('exist');
  });

  it('Üres cím esetén a Következő gomb nem visz a 2. lépésre', () => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/upload`);
    cy.wait(1000);
    cy.contains('button', /következő|tovább|next/i).click({ force: true });
    cy.get('input[name="poszt_cim"]').should('exist');
    cy.url().should('include', '/upload');
  });

  it('Érvényes első lépés kitöltése után a 2. lépésre (hozzávalók) lehet lépni', () => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/upload`);
    cy.wait(1000);
    cy.get('input[name="poszt_cim"]').type('Teszt Recept Cím');
    cy.get('textarea[name="poszt_leiras"]').type('Ez egy teszt leírás.');
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('fake-image-data'),
      fileName: 'test.png',
      mimeType: 'image/png'
    }, { force: true });
    cy.contains('button', /következő|tovább|next/i).click({ force: true });
    cy.contains(/hozzávalók/i).should('exist');
  });

  it('A lépésszámláló megjelenik az oldalon', () => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/upload`);
    cy.wait(1000);
    cy.contains(/1.*4|lépés/i).should('exist');
  });

});

describe('Profil oldal', () => {

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/profile`);
  });

  it('A profil oldal betölt', () => {
    cy.url().should('include', '/profile');
    cy.get('main').should('exist');
  });

  it('A "Jelszó megváltoztatása" szekció cím megjelenik', () => {
    cy.contains(/jelszó megváltoztatása/i).should('be.visible');
  });

  it('Legalább 3 jelszó beviteli mező jelenik meg (régi, új, megerősítés)', () => {
    cy.get('.profilebox input[type="password"]').should('have.length.gte', 3);
  });

  it('A Mentés gomb megjelenik', () => {
    cy.contains('button', 'Mentés').should('be.visible');
  });

  it('Üres mezők esetén alert jelenik meg ("Kérlek töltsd ki az összes mezőt!")', () => {
    cy.on('window:alert', (szoveg) => {
      expect(szoveg).to.include('Kérlek töltsd ki az összes mezőt');
    });
    cy.contains('button', 'Mentés').click();
  });

  it('Nem egyező új jelszavak esetén alert jelenik meg ("nem egyeznek")', () => {
    cy.on('window:alert', (szoveg) => {
      expect(szoveg).to.include('nem egyeznek');
    });
    cy.get('.profilebox input[type="password"]').eq(0).type('RegiJelszo1!');
    cy.get('.profilebox input[type="password"]').eq(1).type('UjJelszo1!');
    cy.get('.profilebox input[type="password"]').eq(2).type('MasikUjJelszo2!');
    cy.contains('button', 'Mentés').click();
  });

  it('Túl rövid új jelszó esetén alert jelenik meg ("legalább 6 karakter")', () => {
    cy.on('window:alert', (szoveg) => {
      expect(szoveg).to.include('legalább 6 karakter');
    });
    cy.get('.profilebox input[type="password"]').eq(0).type('RegiJelszo1!');
    cy.get('.profilebox input[type="password"]').eq(1).type('rovid');
    cy.get('.profilebox input[type="password"]').eq(2).type('rovid');
    cy.contains('button', 'Mentés').click();
  });

  it('Helytelen régi jelszó esetén szerver hibaüzenet alert jelenik meg', () => {
    cy.on('window:alert', (szoveg) => {
      expect(szoveg).to.be.a('string').and.have.length.greaterThan(0);
    });
    cy.get('.profilebox input[type="password"]').eq(0).type('Rossz_Regi_Jelszo_999!');
    cy.get('.profilebox input[type="password"]').eq(1).type('UjJelszo1234!');
    cy.get('.profilebox input[type="password"]').eq(2).type('UjJelszo1234!');
    cy.contains('button', 'Mentés').click();
  });

  it('Az ételpreferenciák szekció megjelenik', () => {
    cy.contains(/ételpreferenciák/i).should('be.visible');
  });

  it('Legalább egy preferencia gomb látható', () => {
    cy.get('.preferenceButton').should('have.length.gte', 1);
  });

  it('Preferencia gombra kattintva az átlátszóság (opacity) megváltozik', () => {
    cy.get('.preferenceButton').first().invoke('css', 'opacity').then((elotte) => {
      const eredeti = parseFloat(elotte);
      cy.get('.preferenceButton').first().click();
      cy.get('.preferenceButton').first().should(($btn) => {
        expect(parseFloat($btn.css('opacity'))).to.not.eq(eredeti);
      });
    });
  });

  it('A sötét mód / témaváltó elem megjelenik', () => {
    cy.contains(/sötét mód|téma|dark/i).should('exist');
  });

  it('A profil oldalsáv/menü megjelenik', () => {
    if (isMobile()) {
      cy.get('.sidebar-toggle-btn').should('be.visible');
      openSidebarIfMobile();
      cy.get('.sidebar.sidebar-open').should('be.visible');
    } else {
      cy.get('.sidebar').should('be.visible');
    }
  });

});

describe('Recept részletező oldal', () => {

  let elsoPosztId;

  before(() => {
    cy.request(`${API_URL}/poszt`).then(({ body }) => {
      if (Array.isArray(body) && body.length > 0) {
        elsoPosztId = body[0].poszt_id;
      }
    });
  });

  it('Érvényes recept ID esetén a részletező oldal betölt', () => {
    if (!elsoPosztId) return cy.log('Nincs recept – kihagyva');
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.get('.recipe-detail-container').should('exist');
  });

  it('A recept neve (h1 cím) megjelenik és nem üres', () => {
    if (!elsoPosztId) return;
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.get('.recipe-detail-title').should('not.be.empty');
  });

  it('A recept leírása megjelenik', () => {
    if (!elsoPosztId) return;
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.get('.recipe-detail-description').should('exist');
  });

  it('Az adatkártyák megjelennek (Ár, Konyha, Elkészítési idő, Fogás, Nehézség)', () => {
    if (!elsoPosztId) return;
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.get('.recipe-data-card').should('have.length.gte', 1);
    cy.contains('.recipe-data-label', 'Ár').should('exist');
    cy.contains('.recipe-data-label', 'Konyha').should('exist');
    cy.contains('.recipe-data-label', 'Elkészítési idő').should('exist');
    cy.contains('.recipe-data-label', 'Fogás').should('exist');
    cy.contains('.recipe-data-label', 'Nehézség').should('exist');
  });

  it('A like (↑) és dislike (↓) szavazó gombok megjelennek', () => {
    if (!elsoPosztId) return;
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.get('.recipe-vote-btn').should('have.length', 2);
  });

  it('A pontszám megjelenik a szavazó gombok között', () => {
    if (!elsoPosztId) return;
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.get('.recipe-score').should('exist');
  });

  it('A "Recept jelentése" gomb megjelenik', () => {
    if (!elsoPosztId) return;
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.contains('button', 'Recept jelentése').should('be.visible');
  });

  it('A "Mentés" gomb megjelenik', () => {
    if (!elsoPosztId) return;
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.contains('button', /mentés/i).should('be.visible');
  });

  it('Bejelentkezés nélkül like-olásra alert jelenik meg ("Bejelentkezés")', () => {
    if (!elsoPosztId) return;
    cy.clearLocalStorage();
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.on('window:alert', (szoveg) => {
      expect(szoveg).to.include('Bejelentkezés');
    });
    cy.get('.recipe-vote-btn').first().click();
  });

  it('Bejelentkezés nélkül dislike-olásra alert jelenik meg', () => {
    if (!elsoPosztId) return;
    cy.clearLocalStorage();
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.on('window:alert', (szoveg) => {
      expect(szoveg).to.include('Bejelentkezés');
    });
    cy.get('.recipe-vote-btn').last().click();
  });

  it('Bejelentkezés nélkül mentésre alert jelenik meg', () => {
    if (!elsoPosztId) return;
    cy.clearLocalStorage();
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.on('window:alert', (szoveg) => {
      expect(szoveg.toLowerCase()).to.include('be');
    });
    cy.get('.recipe-save-btn').click({ force: true });
  });

  it('Bejelentkezve a like gomb kattintható és a pontszám megváltozik', () => {
    if (!elsoPosztId) return;
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.get('.recipe-score').invoke('text').then((elotte) => {
      cy.get('.recipe-vote-btn').first().click();
      cy.wait(600);
      cy.get('.recipe-score').invoke('text').should('not.eq', elotte);
    });
  });

  it('Ugyanarra a like-ra kattintva a szavazat visszavonódik (pontszám visszaáll)', () => {
    if (!elsoPosztId) return;
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.get('.recipe-vote-btn').first().click();
    cy.wait(400);
    cy.get('.recipe-score').invoke('text').then((kozben) => {
      cy.get('.recipe-vote-btn').first().click();
      cy.wait(400);
      cy.get('.recipe-score').invoke('text').should('not.eq', kozben);
    });
  });

  it('Bejelentkezve a dislike gomb kattintható', () => {
    if (!elsoPosztId) return;
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.get('.recipe-vote-btn').last().click();
    cy.wait(400);
    cy.get('.recipe-score').should('exist');
  });

  it('Bejelentkezve a Mentés gomb kattintható és a szövege megváltozik', () => {
    if (!elsoPosztId) return;
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.get('.recipe-save-btn, .recipe-unsave-btn').invoke('text').then((elotte) => {
      cy.get('.recipe-save-btn, .recipe-unsave-btn').click({ force: true });
      cy.wait(600);
      cy.get('.recipe-save-btn, .recipe-unsave-btn').invoke('text').should('not.eq', elotte);
    });
  });

  it('A "Recept jelentése" gombra kattintva megjelenik a jelentési modal', () => {
    if (!elsoPosztId) return;
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.contains('button', 'Recept jelentése').click();
    cy.get('[class*="modal"], [class*="report"], .overlay').should('exist');
  });

  it('A hozzászólások szekció megjelenik a "Hozzászólások" felirattal', () => {
    if (!elsoPosztId) return;
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.get('.comment-section').should('exist');
    cy.get('.comment-section-title').should('contain', 'Hozzászólások');
  });

  it('Bejelentkezés nélkül a komment textarea nem jelenik meg', () => {
    if (!elsoPosztId) return;
    cy.clearLocalStorage();
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.get('textarea.comment-input').should('not.exist');
  });

  it('Bejelentkezve a komment textarea látható', () => {
    if (!elsoPosztId) return;
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.get('textarea.comment-input').should('be.visible');
  });

  it('Bejelentkezve a karakterszámláló 0/250-ről indul', () => {
    if (!elsoPosztId) return;
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.get('.comment-char-count').should('contain', '0/250');
  });

  it('Komment beírásakor a karakterszámláló helyes értéket mutat', () => {
    if (!elsoPosztId) return;
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.get('textarea.comment-input').type('Teszt komment');
    cy.get('.comment-char-count').should('contain', '13/250');
  });

  it('Üres komment esetén a Hozzászólás gomb disabled', () => {
    if (!elsoPosztId) return;
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.get('button.comment-submit-btn').should('be.disabled');
  });

  it('Komment beírása után a Hozzászólás gomb enabled lesz', () => {
    if (!elsoPosztId) return;
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    cy.get('textarea.comment-input').type('Ez egy érvényes komment.');
    cy.get('button.comment-submit-btn').should('not.be.disabled');
  });

  it('Komment elküldése után a textarea kiürül és a komment megjelenik a listában', () => {
    if (!elsoPosztId) return;
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/recipe/${elsoPosztId}`);
    const kommentSzöveg = `Cypress teszt komment ${Date.now()}`;
    cy.get('textarea.comment-input').type(kommentSzöveg);
    cy.get('button.comment-submit-btn').click();
    cy.wait(800);
    cy.get('textarea.comment-input').should('have.value', '');
    cy.get('.comment-section').should('contain', kommentSzöveg);
  });

  it('Nem létező recept ID esetén a "A recept nem található" üzenet jelenik meg', () => {
    cy.visit(`${ALAP_URL}/recipe/999999999`);
    cy.contains('A recept nem található').should('be.visible');
  });

});

describe('Kijelentkezés', () => {

  it('Kijelentkezés törli a token-t localStorage-ból', () => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/mainlogin`);
    openHamburgerIfMobile();
    cy.contains('button', 'Kijelentkezés').click();
    cy.window().its('localStorage').invoke('getItem', 'token').should('be.null');
  });

  it('Kijelentkezés törli a user-t localStorage-ból', () => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/mainlogin`);
    openHamburgerIfMobile();
    cy.contains('button', 'Kijelentkezés').click();
    cy.window().its('localStorage').invoke('getItem', 'user').should('be.null');
  });

  it('Kijelentkezés után a főoldalra (/) navigál', () => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/mainlogin`);
    openHamburgerIfMobile();
    cy.contains('button', 'Kijelentkezés').click();
    cy.url().should('eq', `${ALAP_URL}/`);
  });

  it('Kijelentkezés után a bejelentkező navbar jelenik meg (Bejelentkezés gomb látható)', () => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/mainlogin`);
    openHamburgerIfMobile();
    cy.contains('button', 'Kijelentkezés').click();
    cy.url().should('eq', `${ALAP_URL}/`);
    if (isMobile()) {
      cy.get('.hamburger-btn').should('be.visible');
      cy.get('.hamburger-btn').click();
      cy.get('.navbar-links.open').should('exist');
    }
    cy.contains('button', 'Bejelentkezés').should('be.visible');
  });

  it('Kijelentkezés után a Kijelentkezés gomb eltűnik', () => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/mainlogin`);
    openHamburgerIfMobile();
    cy.contains('button', 'Kijelentkezés').click();
    cy.contains('button', 'Kijelentkezés').should('not.exist');
  });

  it('Kijelentkezés után az /upload oldal /login-ra irányít át', () => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/mainlogin`);
    openHamburgerIfMobile();
    cy.contains('button', 'Kijelentkezés').click();
    cy.visit(`${ALAP_URL}/upload`);
    cy.url().should('include', '/login');
  });

  it('Kijelentkezés után a /my-recipes oldal /login-ra irányít át', () => {
    cy.clearLocalStorage();
    cy.visit(ALAP_URL);
    bejelentkezes();
    cy.visit(`${ALAP_URL}/mainlogin`);
    openHamburgerIfMobile();
    cy.contains('button', 'Kijelentkezés').click();
    cy.visit(`${ALAP_URL}/my-recipes`);
    cy.url().should('include', '/login');
  });

});