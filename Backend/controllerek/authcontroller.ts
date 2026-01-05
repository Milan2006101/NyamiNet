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
    //teszteltetes miatt van itt majd kiszedem
    console.log("JWT_SECRET:", process.env.JWT_SECRET ? "jo" : "szar");
    const connection = await mysql.createConnection(config.database);
  
    try {
      const { felhasznalo_nev, email, jelszo, preferenciak } = req.body;
  
      if (!felhasznalo_nev || !email || !jelszo) {
        return res.status(400).json({ uzenet: "Hiányzó adatok" });
      }
  
      //több táblába való szúrás szóval kötelező a tranzakció
      await connection.beginTransaction();
  
      // email ellenőrzés ha már van akkor vissza 
      const [eredmenysorok]: any = await connection.query(
        "SELECT felhasznalo_id FROM felhasznalok WHERE felhasznalo_email = ?",
        [email]
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
        [felhasznalo_nev, email, jelszo_hash]
      );
  
      //sqlben last insert id
      const felhasznaloId = eredmeny.insertId;
  
      // preferenciak mentese felhasznalo generalt id alapjan
      //mivel tobb preferencia is lehet mapelni kell
      if (Array.isArray(preferenciak) && preferenciak.length > 0) {
        const ertekek = preferenciak.map((prefId: number) => [
          felhasznaloId,
          prefId,
        ]);
  
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
        const { felhasznalo_nev, jelszo } = req.body;

        if (!felhasznalo_nev || !jelszo) {
            return res.status(400).json({ uzenet: "Hiányzó adatok" });
        }

        //nev alapjan lekeres
        const [eredmenysorok]: any = await connection.query(
        `
        SELECT
            felhasznalo_nev,
            felhasznalo_email,
            felhasznalo_jelszo_hash,
            felhasznalo_letiltva
        FROM felhasznalok
        WHERE felhasznalo_nev COLLATE utf8mb4_bin = ?
        `,
        //COLLATE utf8mb4_0900_ai_ci az ekezetek miatt
        [felhasznalo_nev]
        );

        if (eredmenysorok.length === 0) {
        return res.status(401).json({ uzenet: "Hibás felhasználónév vagy jelszó" });
        }

        const user = eredmenysorok[0];
        if (user.felhasznalo_letiltva === 1) {
        return res.status(403).json({ uzenet: "Tiltott felhasznalo" });
        }

        //jelszo ellenorzese,bcryptnek van egy compare fuggvenye
        const csekk = await bcrypt.compare(jelszo, user.felhasznalo_jelszo_hash);
        if (!csekk) {
        return res.status(401).json({ uzenet: "Hibás felhasználónév vagy jelszó" });
        }

        // 5) JWT
        const token = jwt.sign(
            { felhasznalo_id: user.felhasznalo_id, role_id: user.role_id },
            process.env.JWT_SECRET as string,
            { expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"] }
          );
          
        // 6) válasz
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
    } finally {
        await connection.end();
    }
    }