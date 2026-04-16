let adminToken = null;
let adminId = null;
let regularId = null;
let regularToken = null;

const timestamp = Date.now();
const email1 = `cypresstest${timestamp}_1@test.com`;
const email2 = `cypresstest${timestamp}_2@test.com`;
const user1 = `cypressuser${timestamp}_1`;
const user2 = `cypressuser${timestamp}_2`;
const pass = 'Teszt1234';


describe('AdminController alapvető tesztek', () => {
  before(() => {
    // register mindkét felhasználót
    cy.request('POST', '/auth/regisztracio', {
      felhasznalo_nev: user1,
      email: email1,
      jelszo: pass,
    }).then((r) => {
      expect(r.status).to.eq(201);
    });

    cy.request('POST', '/auth/regisztracio', {
      felhasznalo_nev: user2,
      email: email2,
      jelszo: pass,
    }).then((r) => {
      expect(r.status).to.eq(201);
    });

    // bejelentkezés a sima userrel, eltároljuk az idt tiltashoz
    cy.request('POST', '/auth/bejelentkezes', {
      email: email2,
      jelszo: pass,
    }).then((res) => {
      regularToken = res.body.token;
      regularId = res.body.user.felhasznalo_id;
    });

    cy.request('POST', '/auth/bejelentkezes', {
      email: email1,
      jelszo: pass,
    }).then((res) => {
      adminId = res.body.user.felhasznalo_id;
      // előbb módosítani kell a DB-ben
      cy.task('setUserRole', { id: adminId, role: 2 });
      cy.request('POST', '/auth/bejelentkezes', {
        email: email1,
        jelszo: pass,
      }).then((res2) => {
        adminToken = res2.body.token;
      });
    });
  });

  after(() => {
    if (regularId) {
      cy.task('deleteUser', { id: regularId }).then(() => {}, () => {});
    }
    if (adminId) {
      cy.task('deleteUser', { id: adminId }).then(() => {}, () => {});
    }
    cy.task('cleanupTestUsers');
  });

  describe('jogosultság nélkül', () => {
    it('401-et ad ha nincs token a /report/osszes vegponton', () => {
      cy.request({
        method: 'GET',
        url: '/admin/report/osszes',
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });

    it('403-at ad ha nem admin próbálkozik', () => {
      cy.request({
        method: 'GET',
        url: '/admin/report/osszes',
        headers: { Authorization: `Bearer ${regularToken}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
  });

  describe('admin jogosultsággal', () => {
    it('felhasználót le tud tiltani és vissza tud engedni', () => {
      cy.request({
        method: 'PATCH',
        url: `/admin/felhasznalo/${regularId}/ban`,
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { felhasznalo_letiltva: 1 },
      }).then((res) => {
        expect(res.status).to.eq(200);
      });

      cy.request({
        method: 'PATCH',
        url: `/admin/felhasznalo/${regularId}/ban`,
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { felhasznalo_letiltva: 0 },
      }).then((res) => {
        expect(res.status).to.eq(200);
      });
    });

    it('lista lekérések nem dobálnak hibát', () => {
      cy.request({
        method: 'GET',
        url: '/admin/report/osszes',
        headers: { Authorization: `Bearer ${adminToken}` },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
      });

      cy.request({
        method: 'GET',
        url: '/admin/report/poszt',
        headers: { Authorization: `Bearer ${adminToken}` },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
      });
    });

    it('hibás poszt_id-vel 400-at kapunk a részletes jelentésnél', () => {
      cy.request({
        method: 'GET',
        url: '/admin/report/poszt/abc',
        headers: { Authorization: `Bearer ${adminToken}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });

    it('nem létező posztra 200-ast ad a backend (nem dob 404-et)', () => {
      cy.request({
        method: 'PATCH',
        url: '/admin/report/poszt/999999/jovahagy',
        headers: { Authorization: `Bearer ${adminToken}` },
        failOnStatusCode: false,
      }).then((res) => {
        // a controller jelenleg nem jelzi külön ha nincs ilyen poszt,
        // így 200 jön vissza és csak OK
        expect(res.status).to.eq(200);
      });
    });

    it('nem létező poszt törlése 404-et ad', () => {
      cy.request({
        method: 'DELETE',
        url: '/admin/report/poszt/999999',
        headers: { Authorization: `Bearer ${adminToken}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });

    it('nem létező poszt törlése + tiltás 404-et ad', () => {
      cy.request({
        method: 'POST',
        url: '/admin/report/poszt/999999/torlesban',
        headers: { Authorization: `Bearer ${adminToken}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });
  });
});
