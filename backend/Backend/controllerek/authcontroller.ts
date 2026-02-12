import { Request, Response } from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
//import jwt from "jsonwebtoken";
import * as jwt from "jsonwebtoken";
import config from "../config"; 

/* nullként latja
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;
*/

export async function regisztracio(req: Request, res: Response) {
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    const connection = await mysql.createConnection(config.database);
  
    try {
      let { felhasznalo_nev, email, jelszo, preferenciak } = req.body;

      if (!felhasznalo_nev || !email || !jelszo) {
        return res.status(400).json({ uzenet: "Hiányzó adatok" });
      }

      felhasznalo_nev = String(felhasznalo_nev).trim();
      const emailNorm = String(email).trim().toLowerCase();
      //hossz csekkolas
      if (felhasznalo_nev.length < 3 || felhasznalo_nev.length > 30) {
        return res.status(400).json({
          uzenet: "A felhasználónév hossza 3 és 30 karakter között kell legyen",
        });
      }

      //space tiltása, a contains ugye nem megfelelő
      if (/\s/.test(felhasznalo_nev)) {
        return res.status(400).json({
          uzenet: "A felhasználónév nem tartalmazhat szóközt",
        });
      }

      if (!usernameRegex.test(felhasznalo_nev)) {
        return res.status(400).json({
          uzenet: "A felhasználónév ne tartalmazzon speciális karaktert",
        });
      }

      //tommbe valtas
      let prefTomb: number[] = [];

      if (Array.isArray(preferenciak)) {
        prefTomb = preferenciak
          .map((x: any) => Number(x))
          .filter((n) => Number.isInteger(n) && n > 0);
      } else if (typeof preferenciak === "string") {
        prefTomb = preferenciak
          .split(",")
          .map((s) => Number(s.trim()))
          .filter((n) => Number.isInteger(n) && n > 0);
      }
  
      // duplikált prefek kiszűrése (pl. "3,1,3")
      prefTomb = Array.from(new Set(prefTomb));
  
      //több táblába való szúrás szóval kötelező a tranzakció
      await connection.beginTransaction();
  
      // email ellenőrzés ha már van akkor vissza 
      const [eredmenysorok]: any = await connection.query(
        "SELECT felhasznalo_id FROM felhasznalok WHERE felhasznalo_email = ?",
        [emailNorm]
      );
  
      if (eredmenysorok.length > 0) {
        await connection.rollback();
        return res.status(409).json({ uzenet: "email már foglalt" });
      }

      //nevellenorzes
      const [neveredmeny]: any = await connection.query(
        "SELECT felhasznalo_id FROM felhasznalok WHERE felhasznalo_nev COLLATE utf8mb4_bin = ?",
        [felhasznalo_nev]
      );
      
      if (neveredmeny.length > 0) {
        await connection.rollback();
        return res.status(409).json({ uzenet: "felhasználónév már foglalt" });
      }

      // hasheltetes
      const jelszo_hash = await bcrypt.hash(jelszo, 10);
      const [eredmeny]: any = await connection.query(
        `
        INSERT INTO felhasznalok
          (felhasznalo_nev, felhasznalo_email, felhasznalo_jelszo_hash, role_id)
        VALUES (?, ?, ?, 1)
        `,
        [felhasznalo_nev, emailNorm, jelszo_hash]
      );
  
      //sqlben last insert id
      const felhasznaloId = eredmeny.insertId;
  
      // preferenciak mentese felhasznalo generalt id alapjan
      //mivel tobb preferencia is lehet mapelni kell
      if (prefTomb.length > 0) {
        const ertekek = prefTomb.map((prefId) => [felhasznaloId, prefId]);
  
        await connection.query(
          `
          INSERT INTO felhasznalo_preferenciak
            (felhasznalo_id, preferencia_id)
          VALUES ?
          `,
          [ertekek]
        );
      }
  
      await connection.commit();
  
      return res.status(201).json({
        uzenet: "Sikeres regisztráció",
      });
    } finally {
      await connection.end();
    }
  }

  export async function bejelentkezes(req: Request, res: Response) {
    const connection = await mysql.createConnection(config.database);
    console.log("BEJELENTKEZES FUT", req.body);
  
    try {
      const { email, jelszo } = req.body;
  
      if (!email || !jelszo) {
        return res.status(400).json({ uzenet: "Hiányzó adatok" });
      }
  
      
      const emailNorm = String(email).trim().toLowerCase();
  
      const [eredmenysorok]: any = await connection.query(
        `
        SELECT
          felhasznalo_id,
          felhasznalo_nev,
          felhasznalo_email,
          felhasznalo_jelszo_hash,
          felhasznalo_letiltva,
          role_id
        FROM felhasznalok
        WHERE felhasznalo_email = ?
        `,
        [emailNorm]
      );
  
      if (eredmenysorok.length === 0) {
        return res.status(401).json({ uzenet: "Hibás email vagy jelszó" });
      }
  
      const user = eredmenysorok[0];
  
      if (user.felhasznalo_letiltva === 1) {
        return res.status(403).json({ uzenet: "Tiltott felhasználó" });
      }
  
      const ok = await bcrypt.compare(jelszo, user.felhasznalo_jelszo_hash);
      if (!ok) {
        return res.status(401).json({ uzenet: "Hibás email vagy jelszó" });
      }

  
      const token = jwt.sign(
        { felhasznalo_id: user.felhasznalo_id, role_id: user.role_id },
        process.env.JWT_SECRET as string,
        { expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"] }
      );
  
      return res.status(200).json({
        uzenet: "Sikeres bejelentkezés",
        token,
        user: {
          felhasznalo_id: user.felhasznalo_id,
          felhasznalo_nev: user.felhasznalo_nev,
          felhasznalo_email: user.felhasznalo_email,
          role_id: user.role_id,
        },
      });
    } catch (error) {
      console.error("BEJELENTKEZES ERROR:", error);
      return res.status(500).json({ uzenet: "Szerver hiba történt" });
    } finally {
      await connection.end();
    }
  }


export async function jelszoValtoztatas(req: Request, res: Response) {
  const connection = await mysql.createConnection(config.database);

  try {
    const { felhasznalo_id, regi_jelszo, uj_jelszo } = req.body;

    if (!felhasznalo_id || !regi_jelszo || !uj_jelszo) {
      return res.status(400).json({ uzenet: "Hiányzó adatok" });
    }

    // felhasznalo jelszavanak hash lekérése
    const [eredmenysorok]: any = await connection.query(
      "SELECT felhasznalo_jelszo_hash FROM felhasznalok WHERE felhasznalo_id = ?",
      [felhasznalo_id]
    );

    if (eredmenysorok.length === 0) {
      return res.status(404).json({ uzenet: "Felhasználó nem található" });
    }

    const user = eredmenysorok[0];

    // régi jelszó ellenőrzése
    const ok = await bcrypt.compare(regi_jelszo, user.felhasznalo_jelszo_hash);
    if (!ok) {
      return res.status(401).json({ uzenet: "Hibás régi jelszó" });
    }

    // új jelszó hash-elése
    const uj_jelszo_hash = await bcrypt.hash(uj_jelszo, 10);

    // frissítés
    await connection.query(
      "UPDATE felhasznalok SET felhasznalo_jelszo_hash = ? WHERE felhasznalo_id = ?",
      [uj_jelszo_hash, felhasznalo_id]
    );

    return res.status(200).json({ uzenet: "Jelszó sikeresen megváltoztatva" });
  } catch (error) {
    console.error("PASSWORD CHANGE ERROR:", error);
    return res.status(500).json({ uzenet: "Szerver hiba történt" });
  } finally {
    await connection.end();
  }
}
  