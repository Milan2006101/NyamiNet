
let tesztToken = null
let tesztFelhasznaloId = null
const tesztEmail = `cypresstest${Date.now()}@test.com`
const tesztJelszo = 'Teszt1234'
const tesztNev = `cypressuser${Date.now()}`

before(() => {
  cy.request('POST', '/auth/regisztracio', {
    felhasznalo_nev: tesztNev,
    email: tesztEmail,
    jelszo: tesztJelszo
  }).then(() => {
    cy.request('POST', '/auth/bejelentkezes', {
      email: tesztEmail,
      jelszo: tesztJelszo
    }).then((res) => {
      tesztToken = res.body.token
      tesztFelhasznaloId = res.body.user.felhasznalo_id
    })
  })
})

describe('getSzurtPoszt', () => {
  it('visszaadja a posztokat tombkent', () => {
    cy.request('GET', '/poszt').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.be.an('array')
    })
  })

  it('limit parameter mukodik', () => {
    cy.request('GET', '/poszt?limit=2').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.length).to.be.at.most(2)
    })
  })

  it('oldal parameter mukodik', () => {
    cy.request('GET', '/poszt?oldal=1&limit=5').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.be.an('array')
    })
  })

  it('search parameter mukodik', () => {
    cy.request('GET', '/poszt?search=teszt').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.be.an('array')
    })
  })
})

describe('getReszletesPoszt', () => {
  it('letezo poszt reszleteit adja vissza', () => {
    cy.request('GET', '/poszt').then((listRes) => {
      if (listRes.body.length > 0) {
        const elsoPosztId = listRes.body[0].poszt_id
        cy.request('GET', `/poszt/${elsoPosztId}`).then((res) => {
          expect(res.status).to.eq(200)
          expect(res.body).to.have.property('poszt')
          expect(res.body).to.have.property('hozzavalok')
          expect(res.body).to.have.property('lepesSzoveg')
        })
      }
    })
  })

  it('nem letezo poszt eseten is valaszol', () => {
    cy.request({
      method: 'GET',
      url: '/poszt/999999',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.poszt).to.be.null
    })
  })
})

describe('ujPoszt es torles', () => {
  let letrehozottPosztId = null

  it('uj posztot hoz letre majd torli', () => {
    cy.request({
      method: 'POST',
      url: '/poszt',
      headers: { Authorization: `Bearer ${tesztToken}` },
      body: {
        poszt_cim: 'Cypress Teszt Recept',
        poszt_leiras: 'Ez egy cypress teszt leiras',
        poszt_ido: 30,
        poszt_adag: 4,
        ar_id: 1,
        konyha_id: 1,
        fogas_id: 1,
        nehezseg_id: 1,
        szezon_id: 1,
        felhasznalo_id: tesztFelhasznaloId,
        lepesek_szoveg: 'Elso lepes, Masodik lepes',
        hozzavalok: JSON.stringify([
          { hozzavalo_nev: 'cypressTestHozzavalo', mertekegyseg_nev: 'db', mennyiseg: '2' }
        ]),
        preferenciak: '',
        alcimek: ''
      }
    }).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body).to.have.property('poszt_id')
      letrehozottPosztId = res.body.poszt_id

      cy.request('GET', `/poszt/${letrehozottPosztId}`).then((detailRes) => {
        expect(detailRes.status).to.eq(200)
        expect(detailRes.body.poszt.poszt_cim).to.eq('Cypress Teszt Recept')
      })

      cy.request({
        method: 'DELETE',
        url: `/poszt/${letrehozottPosztId}`,
        body: { felhasznalo_id: tesztFelhasznaloId }
      }).then((delRes) => {
        expect(delRes.status).to.eq(200)
      })

      cy.request('GET', `/poszt/${letrehozottPosztId}`).then((checkRes) => {
        expect(checkRes.body.poszt).to.be.null
      })
    })
  })

  it('kotelezo mezok nelkul hibat ad', () => {
    cy.request({
      method: 'POST',
      url: '/poszt',
      headers: { Authorization: `Bearer ${tesztToken}` },
      body: {
        poszt_cim: '',
        poszt_leiras: '',
        felhasznalo_id: tesztFelhasznaloId
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('hozzavalok nelkul hibat ad', () => {
    cy.request({
      method: 'POST',
      url: '/poszt',
      headers: { Authorization: `Bearer ${tesztToken}` },
      body: {
        poszt_cim: 'Teszt',
        poszt_leiras: 'Teszt leiras',
        poszt_ido: 10,
        poszt_adag: 2,
        ar_id: 1,
        konyha_id: 1,
        fogas_id: 1,
        nehezseg_id: 1,
        szezon_id: 1,
        felhasznalo_id: tesztFelhasznaloId,
        lepesek_szoveg: 'lepes',
        hozzavalok: '[]'
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})

describe('segedlekerdezesek', () => {
  it('konyha lista', () => {
    cy.request('GET', '/konyha').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.be.an('array')
      if (res.body.length > 0) {
        expect(res.body[0]).to.have.property('konyha_id')
        expect(res.body[0]).to.have.property('konyha_nev')
      }
    })
  })

  it('fogas lista', () => {
    cy.request('GET', '/fogas').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.be.an('array')
    })
  })

  it('szezon lista', () => {
    cy.request('GET', '/szezon').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.be.an('array')
    })
  })

  it('preferenciak lista', () => {
    cy.request('GET', '/preferenciak').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.be.an('array')
    })
  })
})

// további funkciók: komment, like/dislike, report, mentett posztok

describe('poszt funkciók', () => {
  let posztId = null

  before(() => {
    cy.request({
      method: 'POST',
      url: '/poszt',
      headers: { Authorization: `Bearer ${tesztToken}` },
      body: {
        poszt_cim: 'Funkcio teszt poszt',
        poszt_leiras: 'leiras',
        poszt_ido: 5,
        poszt_adag: 1,
        ar_id: 1,
        konyha_id: 1,
        fogas_id: 1,
        nehezseg_id: 1,
        szezon_id: 1,
        felhasznalo_id: tesztFelhasznaloId,
        lepesek_szoveg: 'lepes',
        hozzavalok: JSON.stringify([{ hozzavalo_nev: 'viz', mertekegyseg_nev: 'ml', mennyiseg: '132' }]),
        preferenciak: '',
        alcimek: ''
      }
    }).then((res) => {
      expect(res.status).to.eq(201)
      posztId = res.body.poszt_id
    })
  })

  after(() => {
    if (posztId) {
      cy.request({
        method: 'DELETE',
        url: `/poszt/${posztId}`,
        body: { felhasznalo_id: tesztFelhasznaloId }
      })
    }
  })

  it('komment hozzaadasa es lekerese', () => {
    cy.request({
      method: 'POST',
      url: '/komment',
      body: {
        felhasznalo_id: tesztFelhasznaloId,
        poszt_id: posztId,
        komment_tartalom: 'Ez egy teszt komment'
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.be.oneOf([201, 200])
    })

    cy.request(`/komment/${posztId}`).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.be.an('array')
      if (res.body.length > 0) {
        expect(res.body[0]).to.have.property('komment_tartalom')
      }
    })
  })

  it('like-kal/ dislike-al szavazat kezelese', () => {
    cy.request({
      method: 'PATCH',
      url: `/poszt/${posztId}/like`,
      headers: { Authorization: `Bearer ${tesztToken}` }
    }).then((res) => {
      expect(res.status).to.eq(200)
    })

    cy.request({
      method: 'PATCH',
      url: `/poszt/${posztId}/dislike`,
      headers: { Authorization: `Bearer ${tesztToken}` }
    }).then((res) => {
      expect(res.status).to.eq(200)
    })

    cy.request(`/poszt/${posztId}/szavazat`).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('szavazat')
    })

    // ruta pontosan "likescore", nem "like-score"
    cy.request(`/poszt/${posztId}/likescore`).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('like_score')
    })
  })

  it('poszt reportolasa', () => {
    // invalid indoklas (helyes végpont a /report)
    cy.request({
      method: 'POST',
      url: '/report',
      headers: { Authorization: `Bearer ${tesztToken}` },
      body: { poszt_id: posztId, indoklas_id: 999, report_szoveg: '' },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400)
    })

    cy.request({
      method: 'POST',
      url: '/report',
      headers: { Authorization: `Bearer ${tesztToken}` },
      body: { poszt_id: posztId, indoklas_id: 1, report_szoveg: 'rossz' }
    }).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body).to.have.property('report_id')
    })
  })

  it('poszt mentese es listazas', () => {
    cy.request({
      method: 'POST',
      url: `/mentett/${posztId}`,
      headers: { Authorization: `Bearer ${tesztToken}` }
    }).then((res) => {
      expect(res.status).to.eq(201)
    })

    cy.request({
      method: 'GET',
      url: '/mentett',
      headers: { Authorization: `Bearer ${tesztToken}` }
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.be.an('array')
    })

    cy.request({
      method: 'DELETE',
      url: `/mentett/${posztId}`,
      headers: { Authorization: `Bearer ${tesztToken}` }
    }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })
})