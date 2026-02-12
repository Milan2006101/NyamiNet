import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import config from "../config"; 

type TokenAdat = {
  felhasznalo_id: number;
  role_id: number;
};

declare global {
  namespace Express {
    interface Request {
      auth?: TokenAdat;
      file?: Express.Multer.File;
    }
  }
}

async function checkUserNotBannedAndGetRole(felhasznalo_id: number) {
  const connection = await mysql.createConnection(config.database);
  try {
    const [rows] = await connection.query<any[]>(
      "SELECT felhasznalo_letiltva, role_id FROM felhasznalok WHERE felhasznalo_id = ?",
      [felhasznalo_id]
    );

    if (!rows || rows.length === 0) return { exists: false, banned: false, role_id: null as number | null };

    const user = rows[0];
    return {
      exists: true,
      banned: Number(user.felhasznalo_letiltva) === 1,
      role_id: Number(user.role_id),
    };
  } finally {
    await connection.end();
  }
}

export async function authRequired(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ uzenet: "Nincs token" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenAdat;

    const info = await checkUserNotBannedAndGetRole(decoded.felhasznalo_id);

    if (!info.exists) {
      res.status(401).json({ uzenet: "Felhasználó nem található" });
      return;
    }

    if (info.banned) {
      res.status(403).json({ uzenet: "A fiók le van tiltva" });
      return;
    }

    req.auth = { felhasznalo_id: decoded.felhasznalo_id, role_id: info.role_id! };

    next();
  } catch {
    res.status(401).json({ uzenet: "Hibás token" });
  }
}

export async function authOptional(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next();
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenAdat;

    const info = await checkUserNotBannedAndGetRole(decoded.felhasznalo_id);

    if (!info.exists) {
      req.auth = undefined;
      next();
      return;
    }

    if (info.banned) {
      res.status(403).json({ uzenet: "A fiók le van tiltva" });
      return;
    }

    req.auth = { felhasznalo_id: decoded.felhasznalo_id, role_id: info.role_id! };
    next();
  } catch {
    req.auth = undefined;
    next();
  }
}
