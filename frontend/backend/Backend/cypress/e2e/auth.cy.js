let tesztToken = null;
let tesztFelhasznaloId = null;
const tesztEmail = `cypresstest${Date.now()}@test.com`;
const tesztJelszo = 'Teszt1234';
const tesztNev = `cypressuser${Date.now()}`;

describe('AuthController egyszerű tesztek', () => {
  before(() => {
    cy.request({
      method: 'POST',
      url: '/auth/regisztracio',
      body: {
        felhasznalo_nev: tesztNev,
        email: tesztEmail,
        jelszo: tesztJelszo,
      },
    }).then((res) => {
      expect(res.status).to.eq(201);
    });
  });

  after(() => {
    // megprobaljuk törölni a felhasználót, ha létre lett hozva
    if (tesztFelhasznaloId) {
      cy.task('deleteUser', { id: tesztFelhasznaloId }).then(() => {}, () => {});
    }
    cy.task('cleanupTestUsers');
  });

  it('duplikált email esetén 409', () => {
    cy.request({
      method: 'POST',
      url: '/auth/regisztracio',
      body: {
        felhasznalo_nev: tesztNev + 'x',
        email: tesztEmail,
        jelszo: tesztJelszo,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(409);
    });
  });

  it('regisztráció hiányzó mezőkkel 400', () => {
    cy.request({
      method: 'POST',
      url: '/auth/regisztracio',
      body: { email: '', felhasznalo_nev: '', jelszo: '' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
    });
  });

  it('bejelentkezés sikeres, token és id visszakapva', () => {
    cy.request('POST', '/auth/bejelentkezes', {
      email: tesztEmail,
      jelszo: tesztJelszo,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('token');
      expect(res.body).to.have.nested.property('user.felhasznalo_id');
      tesztToken = res.body.token;
      tesztFelhasznaloId = res.body.user.felhasznalo_id;
    });
  });

  it('bejelentkezés rossz jelszóval 401', () => {
    cy.request({
      method: 'POST',
      url: '/auth/bejelentkezes',
      body: { email: tesztEmail, jelszo: 'x' + tesztJelszo },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401);
    });
  });

  it('bejelentkezés hiányzó mezőkkel 400', () => {
    cy.request({
      method: 'POST',
      url: '/auth/bejelentkezes',
      body: { email: '', jelszo: '' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
    });
  });
});
