import { Request, Response, NextFunction } from "express";

export function ensureSelf(req: Request, res: Response, next: NextFunction) {
  if (!req.auth) return res.status(401).json({ uzenet: "Nincs token" });

  const paramId = Number(req.params.id);
  if (req.auth.felhasznalo_id !== paramId) {
    return res.status(403).json({ uzenet: "Csak saját fiókot módosíts!" });
  }

  return next();
}
