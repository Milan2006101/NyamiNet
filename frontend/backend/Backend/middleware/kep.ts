import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";

export function handleMulterError(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!err) {
    next();
    return;
  }

  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ uzenet: "A kép túl nagy (max 5MB)" });
      return;
    }

    res.status(400).json({ uzenet: "Hiba történt a képfeltöltés során" });
    return;
  }

  if (typeof err.message === "string" && err.message.includes("Csak képek")) {
    res.status(400).json({ uzenet: err.message });
    return;
  }

  res.status(400).json({ uzenet: "Hiba történt a képfeltöltés során" });
}
