import { Request, Response } from "express";
import mysql from "mysql2/promise";
import config from "../config"; // nálad így van


export async function userTiltasAllitas(req: Request, res: Response) {
  const connection = await mysql.createConnection(config.database);
  try {
    const id = Number(req.params.id);
    const felhasznalo_letiltva = Number(req.body.felhasznalo_letiltva);

    if (![0, 1].includes(felhasznalo_letiltva)) {
      return res.status(400).json({ uzenet: "felhasznalo_letiltva csak 0 vagy 1 lehet" });
    }

    const [result] = await connection.query<any>(
      "UPDATE felhasznalok SET felhasznalo_letiltva = ? WHERE felhasznalo_id = ?",
      [felhasznalo_letiltva, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ uzenet: "Nincs ilyen felhasználó" });
    }

    return res.json({ uzenet: "OK" });
  } catch {
    return res.status(500).json({ uzenet: "Szerver hiba" });
  } finally {
    await connection.end();
  }
}

export async function getBejelentettPosztok(_req: Request, res: Response) {
  const connection = await mysql.createConnection(config.database);
  try {
    const [resultSets] = await connection.query<any[]>("CALL get_reported_posztok()");
    const rows = resultSets[0];
    return res.json(rows);
  } catch {
    return res.status(500).json({ uzenet: "Szerver hiba" });
  } finally {
    await connection.end();
  }
}

export async function getBejelentesekPoszthoz(req: Request, res: Response) {
  const connection = await mysql.createConnection(config.database);
  try {
    const poszt_id = Number(req.params.poszt_id);
    if (!Number.isFinite(poszt_id)) {
      return res.status(400).json({ uzenet: "Hibás poszt_id" });
    }

    const [resultSets] = await connection.query<any[]>(
      "CALL reszletesreportoltposzt(?)",
      [poszt_id]
    );
    const rows = resultSets[0];
    return res.json(rows);
  } catch {
    return res.status(500).json({ uzenet: "Szerver hiba" });
  } finally {
    await connection.end();
  }
}

export async function jovahagyBejelentettPoszt(req: Request, res: Response) {
  const connection = await mysql.createConnection(config.database);
  try {
    const poszt_id = Number(req.params.poszt_id);

    const [resultSets] = await connection.query<any[]>(
      "CALL engedelyezes(?)",
      [poszt_id]
    );

    const meta = resultSets[0]?.[0]; 
    return res.json({ uzenet: "OK", ...meta });
  } catch (e: any) {
    const msg = e?.sqlMessage || "Szerver hiba";
    const code = msg === "Nincs ilyen poszt" ? 404 : 500;
    return res.status(code).json({ uzenet: msg });
  } finally {
    await connection.end();
  }
}

// Visszaadja a posztoló id-t, hogy a kliens/back-end utána bannolhasson, ha akar.
export async function torolBejelentettPoszt(req: Request, res: Response) {
  const connection = await mysql.createConnection(config.database);
  try {
    const poszt_id = Number(req.params.poszt_id);

    const [resultSets] = await connection.query<any[]>(
      "CALL reportoltposzttorles(?)",
      [poszt_id]
    );

    const posztolo_id = resultSets[0]?.[0]?.posztolo_id;
    return res.json({ uzenet: "OK", posztolo_id });
  } catch (e: any) {
    const msg = e?.sqlMessage || "Szerver hiba";
    const code = msg === "Nincs ilyen poszt" ? 404 : 500;
    return res.status(code).json({ uzenet: msg });
  } finally {
    await connection.end();
  }
}

// Combo végpont: poszt törlés (procedure) + posztoló tiltás (update)
export async function torolBejelentettPosztEsTiltasPoszt(req: Request, res: Response) {
  const connection = await mysql.createConnection(config.database);

  try {
    const poszt_id = Number(req.params.poszt_id);
    //  poszt + report törlés procedure-ből, visszakapjuk a posztoló id-t
    const [resultSets] = await connection.query<any[]>(
      "CALL reportoltposzttorles(?)",
      [poszt_id]
    );

    const posztolo_id = resultSets?.[0]?.[0]?.posztolo_id;
    if (!posztolo_id) {
      // ha a procedure nem tér vissza
      return res.status(500).json({ uzenet: "Nem sikerült posztolo_id-t lekérni" });
    }

    //  ban 
    await connection.query(
      "UPDATE felhasznalok SET felhasznalo_letiltva = 1 WHERE felhasznalo_id = ?",
      [posztolo_id]
    );

    return res.json({ uzenet: "OK", posztolo_id, felhasznalo_letiltva: 1 });
  } catch (e: any) {
    const msg = e?.sqlMessage || "Szerver hiba";
    const code = msg === "Nincs ilyen poszt" ? 404 : 500;
    return res.status(code).json({ uzenet: msg });
  } finally {
    await connection.end();
  }
}