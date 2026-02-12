import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage: StorageEngine = multer.diskStorage({
  destination: (
    __req: Request,
    __file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, uploadDir);
  },
  filename: (
    __req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    //timestamp + random számmal a fájl neve egyedi legyen
    const egyediSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const kiterjesztes = path.extname(file.originalname);
    const alapnev = path.basename(file.originalname, kiterjesztes);
    cb(null, `${alapnev}-${egyediSuffix}${kiterjesztes}`);
  }
});

const fileFilter = (
  __req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const engedelmezettTipusok = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (engedelmezettTipusok.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Csak képek (JPEG, PNG, GIF, WebP) engedélyezettek!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default upload;
