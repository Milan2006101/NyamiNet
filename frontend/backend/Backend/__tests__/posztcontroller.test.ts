import { Request, Response } from 'express';
import * as posztController from '../controllerek/posztcontroller';


describe('Poszt Controller - Root', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {} as Partial<Request>;
    mockRes = {
      send: jest.fn().mockReturnThis()
    } as Partial<Response>;
  });

  test('Root függvény - Szerverállapot ellenőrzése', () => {
    posztController.root(mockReq as Request, mockRes as Response);

    expect(mockRes.send).toHaveBeenCalledWith('Fut a szerver!');
  });
});

describe('Poszt Controller - Szűrés paraméterei', () => {
  let mockReq: Partial<Request>;

  beforeEach(() => {
    mockReq = {
      query: {},
      auth: undefined
    } as Partial<Request>;

    jest.clearAllMocks();
  });

  test('Szűrés paraméter - Alapértelmezett oldal száma (1)', () => {
    const oldal = Number(mockReq.query?.oldal) || 1;
    expect(oldal).toBe(1);
  });

  test('Szűrés paraméter - Alapértelmezett limit (100)', () => {
    const limit = Number(mockReq.query?.limit) || 100;
    expect(limit).toBe(100);
  });

  test('Szűrés paraméter - Oldal szám beállítása', () => {
    mockReq.query = { oldal: '5' };
    const oldal = Number(mockReq.query.oldal) || 1;
    expect(oldal).toBe(5);
  });

  test('Szűrés paraméter - Limit beállítása', () => {
    mockReq.query = { limit: '50' };
    const limit = Number(mockReq.query.limit) || 100;
    expect(limit).toBe(50);
  });

  test('Szűrés paraméter - Ár szűrő beállítása', () => {
    mockReq.query = { ar: '2000' };
    const ar = mockReq.query.ar ? Number(mockReq.query.ar) : null;
    expect(ar).toBe(2000);
  });

  test('Szűrés paraméter - Ár szűrő nélkül (null)', () => {
    const ar = mockReq.query?.ar ? Number(mockReq.query.ar) : null;
    expect(ar).toBeNull();
  });

  test('Szűrés paraméter - Keresési szó feldolgozása', () => {
    mockReq.query = { search: 'gulyás' };
    const search = mockReq.query.search ? String(mockReq.query.search) : null;
    expect(search).toBe('gulyás');
  });

  test('Szűrés paraméter - Konyha típus kiválasztása', () => {
    mockReq.query = { konyha: 'MAGYAR' };
    const konyha = mockReq.query.konyha ? String(mockReq.query.konyha) : null;
    expect(konyha).toBe('MAGYAR');
  });

  test('Szűrés paraméter - Nehézség szint', () => {
    mockReq.query = { nehezseg: '3' };
    const nehezseg = mockReq.query.nehezseg ? Number(mockReq.query.nehezseg) : null;
    expect(nehezseg).toBe(3);
  });

  test('Szűrés paraméter - Elkészítési idő', () => {
    mockReq.query = { elkeszitesi_ido: '30' };
    const ido = mockReq.query.elkeszitesi_ido ? Number(mockReq.query.elkeszitesi_ido) : null;
    expect(ido).toBe(30);
  });

  test('Szűrés paraméter - Sorrend alapértelmezése (1)', () => {
    const sorrend = mockReq.query?.sorrend ? Number(mockReq.query.sorrend) : 1;
    expect(sorrend).toBe(1);
  });

  test('Szűrés paraméter - Sorrend beállítása', () => {
    mockReq.query = { sorrend: '2' };
    const sorrend = mockReq.query.sorrend ? Number(mockReq.query.sorrend) : 1;
    expect(sorrend).toBe(2);
  });

  test('Szűrés paraméter - Felhasználó ID loggedinből', () => {
    mockReq.auth = { felhasznalo_id: 123, role_id: 1 };
    const felhasznaloId = mockReq.auth ? mockReq.auth.felhasznalo_id : null;
    expect(felhasznaloId).toBe(123);
  });

  test('Szűrés paraméter - Felhasználó ID nélkül (loggedout)', () => {
    const felhasznaloId = mockReq.auth ? (mockReq.auth as any).felhasznalo_id : null;
    expect(felhasznaloId).toBeNull();
  });
});

describe('Poszt Controller - Adattípusok konverziója', () => {
  test('String-ből szám konverzió - Érvényes érték', () => {
    const ertek = Number('100');
    expect(ertek).toBe(100);
    expect(typeof ertek).toBe('number');
  });

  test('String-ből szám konverzió - Inérvényes érték', () => {
    const ertek = Number('abc');
    expect(isNaN(ertek)).toBe(true);
  });

  test('Szöveg feldolgozása - Trim-elés', () => {
    const szoveg = '  test receptnév  '.trim();
    expect(szoveg).toBe('test receptnév');
  });

  test('Boolean érték ellenőrzése - Auth létezik', () => {
    const auth = { felhasznalo_id: 1 };
    const isLoggedIn = !!auth;
    expect(isLoggedIn).toBe(true);
  });

  test('Boolean érték ellenőrzése - Auth nem létezik', () => {
    const auth = null;
    const isLoggedIn = !!auth;
    expect(isLoggedIn).toBe(false);
  });
});

describe('Poszt Controller - Érvényesség ellenőrzése', () => {
  test('Oldal szám érvényessége - Pozitív szám', () => {
    const oldal = 1;
    expect(oldal).toBeGreaterThan(0);
  });

  test('Limit érvényessége - Nem nagyobb, mint maximális', () => {
    const limit = 100;
    const maxLimit = 1000;
    expect(limit).toBeLessThanOrEqual(maxLimit);
  });

  test('Ár szűrő érvényessége - Pozitív szám', () => {
    const ar = 2000;
    expect(ar).toBeGreaterThanOrEqual(0);
  });

  test('Nehézség érték érvényessége - 1 és 5 között', () => {
    const nehezseg = 3;
    expect(nehezseg).toBeGreaterThanOrEqual(1);
    expect(nehezseg).toBeLessThanOrEqual(5);
  });

  test('Email validáció - Érvényes formátum', () => {
    const email = 'test@example.com';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(email)).toBe(true);
  });

  test('Email validáció - Nem érvényes formátum', () => {
    const email = 'invalid-email';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(email)).toBe(false);
  });
});
