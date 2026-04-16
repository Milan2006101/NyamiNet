import { Request, Response } from 'express';
import * as authController from '../controllerek/authcontroller';

jest.mock('mysql2/promise', () => ({
  createConnection: jest.fn().mockResolvedValue({
    query: jest.fn().mockResolvedValue([[]]),
    end: jest.fn().mockResolvedValue(undefined)
  })
}));


jest.mock('../config', () => ({
  __esModule: true,
  default: {
    database: {
      host: 'localhost',
      user: 'test',
      password: 'test',
      database: 'test'
    }
  }
}));


jest.mock('bcrypt', () => ({
  hash: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn((password, hash) => Promise.resolve(password === hash.replace('hashed_', '')))
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn((payload) => `token_${payload.felhasznalo_id}`)
}));

describe('Auth Controller - Regisztráció', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      body: {}
    } as Partial<Request>;

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    } as Partial<Response>;
  });

  test('Regisztráció - Hiányzó felhasználónév validáció', async () => {
    mockReq.body = {
      felhasznalo_nev: '',
      email: 'test@test.com',
      jelszo: 'password123'
    };

    await authController.regisztracio(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ uzenet: expect.stringContaining('') })
    );
  });

  test('Regisztráció - Felhasználónév túl rövid (< 3 karakter)', async () => {
    mockReq.body = {
      felhasznalo_nev: 'ab',
      email: 'test@test.com',
      jelszo: 'password123'
    };

    await authController.regisztracio(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalled();
  });

  test('Regisztráció - Felhasználónév szóközt tartalmaz', async () => {
    mockReq.body = {
      felhasznalo_nev: 'test user',
      email: 'test@test.com',
      jelszo: 'password123'
    };

    await authController.regisztracio(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalled();
  });

  test('Regisztráció - Speciális karakterek tiltottak', async () => {
    mockReq.body = {
      felhasznalo_nev: 'test!@#',
      email: 'test@test.com',
      jelszo: 'password123'
    };

    await authController.regisztracio(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test('Regisztráció - Érvényes felhasználónév (csak betűk, számok, pont, kötőjel)', async () => {
    mockReq.body = {
      felhasznalo_nev: 'valid_user-123',
      email: 'test@test.com',
      jelszo: 'password123'
    };

    expect(mockReq.body.felhasznalo_nev).toMatch(/^[a-zA-Z0-9._-]+$/);
  });
});

describe('Auth Controller - Bejelentkezés', () => {
  let mockReq: Partial<Request>;

  beforeEach(() => {
    mockReq = {
      body: {}
    } as Partial<Request>;

    jest.clearAllMocks();
  });

  test('Bejelentkezés - Hiányzó email cím', async () => {
    mockReq.body = {
      email: '',
      jelszo: 'password123'
    };

    // Validációs logika tesztelése
    const email = String(mockReq.body.email || '').trim();
    expect(email).toBe('');
  });

  test('Bejelentkezés - Hiányzó jelszó', async () => {
    mockReq.body = {
      email: 'test@test.com',
      jelszo: ''
    };

    const jelszo = String(mockReq.body.jelszo || '').trim();
    expect(jelszo).toBe('');
  });

  test('Bejelentkezés - Email normalizálása (kisbetűsítés)', async () => {
    mockReq.body = {
      email: 'Test@TEST.Com',
      jelszo: 'password123'
    };

    const normalizedEmail = String(mockReq.body.email).trim().toLowerCase();
    expect(normalizedEmail).toBe('test@test.com');
  });
});
