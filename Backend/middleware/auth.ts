import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

type TokenAdat = {
  felhasznalo_id: number;
  role_id: number;
};

declare global {
  namespace Express {
    interface Request {
      auth?: TokenAdat;
    }
  }
}

export function authRequired(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //header kiolvasas
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ uzenet: "Nincs token" });
  }

  //Bearer token -> token
  const token = authHeader.replace("Bearer ", "");

  // token csekk
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenAdat;
    req.auth = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ uzenet: "Hibás token" });
  }
}
