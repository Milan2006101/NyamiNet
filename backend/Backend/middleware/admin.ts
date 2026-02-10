import { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.auth) {
    res.status(401).json({ uzenet: "Nincs bejelentkezve" });
    return;
  }

  if (req.auth.role_id !== 2) {
    res.status(403).json({ uzenet: "Admin jogosultság szükséges" });
    return;
  }

  next();
}
