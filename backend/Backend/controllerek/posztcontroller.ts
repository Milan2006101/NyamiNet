import { Request, Response } from "express"
import mysql from "mysql2/promise"
import config from "../config"
import fs from "fs"
import path from "path"

export function root(_req: Request, res: Response) {
    res.send("Fut a szerver!")
}


export async function getSzurtPoszt(req: Request, res: Response) {
    const connection = await mysql.createConnection(config.database);
    await connection.query("SET NAMES utf8mb4 COLLATE utf8mb4_hungarian_ci"); //rossz collate
    try {
        const oldal = Number(req.query.oldal) || 1;
        const limit = Number(req.query.limit) || 100;

        const search = req.query.search ? String(req.query.search) : null;
        const ar = req.query.ar ? Number(req.query.ar) : null;
        const konyha = req.query.konyha ? String(req.query.konyha) : null;
        const fogas = req.query.fogas ? String(req.query.fogas) : null;
        const szezon = req.query.szezon ? String(req.query.szezon) : null;

        const ido = req.query.elkeszitesi_ido ? Number(req.query.elkeszitesi_ido) : null;
        //datumszűrés, amennyi eltelt napon belül legyen a ma az 0
        const nap = req.query.nap ? Number(req.query.nap) : null;
        const nehezseg = req.query.nehezseg ? Number(req.query.nehezseg) : null;

        const allergia   = req.query.preferencia ? String(req.query.preferencia) : null;
        //1- random 2- ujabb elől 3- régebbi elől 4- legtöbb like elől
        const sorrend    = req.query.sorrend ? Number(req.query.sorrend) : 1;
       const felhasznaloId = req.auth ? req.auth.felhasznalo_id : null;

        const [eredmenysorok]: any = await connection.query(
        "CALL get_szurt_posztok(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            limit,
            oldal,
            search,
            ar,
            konyha,
            ido,
            allergia,
            nap,
            fogas,
            nehezseg,
            szezon,
            sorrend,
            felhasznaloId
        ]
        );

        // ha a felhasználó be van jelentkezve mutatjuk hogy likeolt dislikeolt-e
        let felhasznaloSzavazata: any = null;
        if (req.auth) {
            const felhasznaloId = req.auth.felhasznalo_id;
            const [szavazassorok]: any = await connection.query(
                "SELECT poszt_id, szavazat FROM poszt_szavazas WHERE felhasznalo_id = ?",
                [felhasznaloId]
            );
            
            // szavazatok egy objektumba (poszt_id -> szavazat)
            felhasznaloSzavazata = {};
            for (const szavazat of szavazassorok) {
                felhasznaloSzavazata[szavazat.poszt_id] = szavazat.szavazat;
            }
        }

        // szavazati információ hozzáadása a posztokhoz
        const posztokSzavazatokkal = eredmenysorok[0].map((poszt: any) => ({
            ...poszt,
            user_vote: req.auth ? (felhasznaloSzavazata[poszt.poszt_id] || null) : null
        }));

        res.status(200).json(posztokSzavazatokkal);

    } finally {
        await connection.end();
    }
}

export async function getReszletesPoszt(req: Request, res: Response) {
    const connection = await mysql.createConnection(config.database);

    try {
        const posztId = Number(req.params.id);
        //eredmenysorok = poszt adatok + hozzávalók + lépések
        const [eredmenysorok]: any = await connection.query("CALL reszletesposzt(?)", [posztId]);

        //kétdimenziós a select
        const poszt = eredmenysorok[0][0] || null;
        //több sor 
        const hozzavalok = eredmenysorok[1];
        const lepesSzoveg = eredmenysorok[2][0]?.lepesek_szoveg;

        res.status(200).json({
            poszt,
            hozzavalok,
            lepesSzoveg
        });

    } finally {
        await connection.end();
    }
}

export async function ujPoszt(req: Request, res: Response) {
    const connection = await mysql.createConnection(config.database);

    try {
        //több adatbázis miatt szükséges
        await connection.beginTransaction();

        const {
            poszt_cim,
            poszt_leiras,
            poszt_ido,
            poszt_adag,
            ar_id,
            konyha_id,
            fogas_id,
            nehezseg_id,
            szezon_id,
            felhasznalo_id,
            lepesek_szoveg
        } = req.body;

        // KÖTELEZŐ MEZŐK VALIDÁLÁSA
        if (!poszt_cim || !poszt_leiras || !felhasznalo_id) {
            return res.status(400).json({ uzenet: "poszt_cim, poszt_leiras, felhasznalo_id kötelezőek" });
        }

        // ID-k VALIDÁLÁSA (integer-ek kell legyenek)
        const requiredIds = { ar_id, konyha_id, fogas_id, nehezseg_id, szezon_id };
        for (const [key, value] of Object.entries(requiredIds)) {
            if (!value || isNaN(Number(value))) {
                return res.status(400).json({ uzenet: `${key} érvénytelen vagy hiányzik` });
            }
        }

        // képfájl kezelése - multer-ből jön
        let poszt_kepurl = null;
        if (req.file) {
            // fájl URL-je: /uploads/filename
            poszt_kepurl = `/uploads/${req.file.filename}`;
        }

        const hozzavalo_ids = [];
        const mennyisegek = [];
        const mertekegyseg_ids = [];

        let hozzavalokParsed: any[] = [];

        if (Array.isArray(req.body.hozzavalok)) {
            hozzavalokParsed = req.body.hozzavalok;
        } else if (typeof req.body.hozzavalok === "string") {
            try {
                hozzavalokParsed = JSON.parse(req.body.hozzavalok);
            } catch {
                return res.status(400).json({ uzenet: "A hozzavalok nem érvényes JSON" });
            }
        } else {
            hozzavalokParsed = [];
        }

        if (!Array.isArray(hozzavalokParsed) || hozzavalokParsed.length === 0) {
            return res.status(400).json({ uzenet: "A hozzavalok mező kötelező (tömb)" });
        }

        for (const h of hozzavalokParsed) {
            if (!h?.hozzavalo_nev || !h?.mertekegyseg_nev || h?.mennyiseg == null) {
                return res.status(400).json({ uzenet: "Hibás hozzavalok elem formátum" });
            }

            const hozzavalo_nev = String(h.hozzavalo_nev).trim();
            const mertekegyseg_nev = String(h.mertekegyseg_nev).trim();
            const mennyiseg = String(h.mennyiseg).trim();

            // létezik-e már a hozzávaló
            let [hozzavaloRows]: any = await connection.query(
                "SELECT hozzavalo_id FROM hozzavalok WHERE hozzavalo_nev = ?",
                [hozzavalo_nev]
            );

            let hozzavalo_id;
            if (hozzavaloRows.length > 0) {
                hozzavalo_id = hozzavaloRows[0].hozzavalo_id;
            } else {
                // beillesztés
                const [insertResult]: any = await connection.query(
                    "INSERT INTO hozzavalok (hozzavalo_nev) VALUES (?)",
                    [hozzavalo_nev]
                );
                hozzavalo_id = insertResult.insertId;
            }

            // létezike már a mértékegység
            let [mertekRows]: any = await connection.query(
                "SELECT mertekegyseg_id FROM mertekegyseg WHERE mertekegyseg_nev = ?",
                [mertekegyseg_nev]
            );

            let mertekegyseg_id;
            if (mertekRows.length > 0) {
                mertekegyseg_id = mertekRows[0].mertekegyseg_id;
            } else {
                // mértékegység beillesztés
                const [insertResult]: any = await connection.query(
                    "INSERT INTO mertekegyseg (mertekegyseg_nev) VALUES (?)",
                    [mertekegyseg_nev]
                );
                mertekegyseg_id = insertResult.insertId;
            }

            hozzavalo_ids.push(hozzavalo_id);
            mennyisegek.push(mennyiseg);
            mertekegyseg_ids.push(mertekegyseg_id);
        }

        const hozzavalo_ids_str = hozzavalo_ids.join(",");
        const mennyisegek_str = mennyisegek.join(",");
        const mertekegyseg_ids_str = mertekegyseg_ids.join(",");

        // nemlehetnek konstansok a split miatt
        let preferenciakString = String(req.body.preferenciak || "");
        let alcimekString = String(req.body.alcimek || "");

        let preferenciak = preferenciakString
        .split(",")
        .map(x => x.trim())
        .filter(x => x && x !== "" && x !== "null" && !isNaN(Number(x))); // filter

        let alcimek = alcimekString
        .split(",")
        .map(x => x.trim())
        .filter(x => x && x !== "" && x !== "null"); // filter


        const [eredmeny]: any = await connection.query(
            "CALL uj_poszt_felvetele(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                String(poszt_cim).trim(),
                String(poszt_leiras).trim(),
                Number(poszt_ido) || 0,
                Number(poszt_adag) || 0,
                Number(ar_id),
                Number(konyha_id),
                Number(fogas_id),
                Number(nehezseg_id),
                Number(szezon_id),
                poszt_kepurl,
                Number(felhasznalo_id),
                String(lepesek_szoveg || "").trim(),

                hozzavalo_ids_str,
                mennyisegek_str,
                mertekegyseg_ids_str,
            ]
        );
        //kiveszem az id-t hogy tudjam befuzni a többit
        const ujPosztId = eredmeny[0][0].poszt_id;



        //TÖBBI ADATBÁZISBA FŰZÉS (a lépések id nem összekapcsolótáblás ezért van a procedureben)

        //preferenciak
        if (Array.isArray(preferenciak) && preferenciak.length > 0) {
            for (const preferenciaId of preferenciak) {
                if (preferenciaId && !isNaN(Number(preferenciaId))) {
                    await connection.query(
                        "INSERT INTO poszt_preferenciak (poszt_id, preferencia_id) VALUES (?, ?)",
                        [ujPosztId, Number(preferenciaId)]
                    );
                }
            }
        }


        // alcimek
        if (Array.isArray(alcimek) && alcimek.length > 0) {
            const alcimSzoveg = alcimek.join(", ");
            await connection.query(
                "UPDATE poszt SET poszt_alcimek = ? WHERE poszt_id = ?",
                [alcimSzoveg, ujPosztId]
            );
        }

        //minden olyan, amit eddig futtattam most kerül be
        await connection.commit();

        return res.status(201).json({
            uzenet: "poszt tétrejött",
            poszt_id: ujPosztId
        });

    } catch (hiba) {
        console.error("Hiba az új poszt feltöltése során:", hiba);
        await connection.rollback();
        
        // feltöltött kép törlése, ha hiba történt
        if (req.file) {
            const uplodDir = path.join(__dirname, "../../uploads");
            const filePath = path.join(uplodDir, req.file.filename);
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (fileError) {
                console.error("Hiba a fájl törlésénél:", fileError);
            }
        }
        
        return res.status(500).json({
            uzenet: "Hiba történt a poszt feltöltése során",
            hiba: hiba instanceof Error ? hiba.message : String(hiba)
        });
    } finally {
        await connection.end();
    }
}

export async function getfelhasznaloPreferenciak(req: Request, res: Response) {
    const connection = await mysql.createConnection(config.database);
  
    try {
      if (!req.auth) return res.status(401).json({ uzenet: "Nincs token" });
  
      const felhasznaloId = req.auth.felhasznalo_id;
  
      const [eredmenysorok]: any = await connection.query(
        `
        SELECT 
          p.preferencia_id,
          p.preferencia_nev
        FROM felhasznalo_preferenciak fp
        JOIN preferenciak p 
          ON fp.preferencia_id = p.preferencia_id
        WHERE fp.felhasznalo_id = ?
        `,
        [felhasznaloId]
      );
  
      return res.status(200).json(eredmenysorok);
    } finally {
      await connection.end();
    }
  }

export async function PreferenciaKezeles(req: Request, res: Response) {
    const connection = await mysql.createConnection(config.database);

    try {
        //tokencsekk
        if (!req.auth) return res.status(401).json({ uzenet: "Nincs token" });

        const felhasznaloId = req.auth.felhasznalo_id;
        const { preferencia_nev } = req.body;

        // preferencia id lekérése
        const [prefRows]: any = await connection.query(
            "SELECT preferencia_id FROM preferenciak WHERE preferencia_nev = ?",
            [preferencia_nev]
        );

        if (prefRows.length === 0) {
            return res.status(404).json({ message: "A megadott preferencia nem létezik" });
        }

        const preferenciaId = prefRows[0].preferencia_id;

        // már van-e a preferencia
        const [existingRows]: any = await connection.query(
            "SELECT * FROM felhasznalo_preferenciak WHERE felhasznalo_id = ? AND preferencia_id = ?",
            [felhasznaloId, preferenciaId]
        );

        let eredmeny;
        if (existingRows.length > 0) {
            // eltávolítás
            await connection.query(
                "DELETE FROM felhasznalo_preferenciak WHERE felhasznalo_id = ? AND preferencia_id = ?",
                [felhasznaloId, preferenciaId]
            );
            eredmeny = "eltávolítva";
        } else {
            // hozzáadás
            await connection.query(
                "INSERT INTO felhasznalo_preferenciak (felhasznalo_id, preferencia_id) VALUES (?, ?)",
                [felhasznaloId, preferenciaId]
            );
            eredmeny = "hozzáadva";
        }

        return res.status(200).json({ eredmeny });
    } catch (error) {
        console.error('Error in PreferenciaKezeles:', error);
        return res.status(500).json({ 
            uzenet: "Hiba történt a preferencia kezelése során",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

export async function SotetMod(req: Request, res: Response) {
    const connection = await mysql.createConnection(config.database);
    
    try {
        const felhasznaloId = Number(req.params.id);

        //1-0 = 1 , 1-1 = 0
        await connection.query(
            `
            UPDATE felhasznalok
            SET sotet_mod = 1 - sotet_mod
            WHERE felhasznalo_id = ?
            `,
            [felhasznaloId]
        );

        // aktuális érték
        const [eredmenysorok]: any = await connection.query(
            `
            SELECT sotet_mod
            FROM felhasznalok
            WHERE felhasznalo_id = ?
            `,
            [felhasznaloId]
        );

        return res.status(200).json({sotet_mod: eredmenysorok[0].sotet_mod});
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}




export async function getKomment(req: Request, res: Response) {
    const connection = await mysql.createConnection(config.database);


    try {
        const id = Number(req.params.posztid);

        const [eredmenysorok]: any = await connection.query(
            "CALL kommentek_lekerese(?)",
            [id]
        );

        return res.status(200).json(eredmenysorok[0]);

    } finally {
        await connection.end();
    }
}

export async function hozzaadKomment(req: Request, res: Response) {
    const connection = await mysql.createConnection(config.database);

    try {
        const { felhasznalo_id, poszt_id, komment_tartalom } = req.body;

        if (!felhasznalo_id || !poszt_id || !komment_tartalom) {
            return res.status(400).json({ uzenet: "hianyzo adatok" });
        }
        //komment karakterlimit
        if (komment_tartalom.length > 250) {
            return res.status(400).json({
                uzenet: "tul hosszu a komment"
            });
        }

        await connection.query(
            "CALL komment_hozzaadasa(?, ?, ?)",
            [felhasznalo_id, poszt_id, komment_tartalom]
        );

        return res.status(201).json({ uzenet: "Komment hozzáadva" });

    } finally {
        await connection.end();
    }
}

export async function likeolas(req: Request, res: Response) {
    const connection = await mysql.createConnection(config.database);

    try {
        const posztId = Number(req.params.id);
        const felhasznaloId = req.body.felhasznalo_id;

        await connection.query(
            "CALL likekezeles(?, ?, 1)",
            [felhasznaloId, posztId]
        );

        res.status(200).json({ uzenet: "likoltad" });
    } finally {
        await connection.end();
    }
}

export async function dislikeolas(req: Request, res: Response) {
    const connection = await mysql.createConnection(config.database);

    try {
        const posztId = Number(req.params.id);
        const felhasznaloId = req.body.felhasznalo_id;

        await connection.query(
            "CALL likekezeles(?, ?, -1)",
            [felhasznaloId, posztId]
        );

        res.status(200).json({ uzenet: "Dislike frissítve" });
    } finally {
        await connection.end();
    }
}


export async function ReportPoszt(req: Request, res: Response) {
  const connection = await mysql.createConnection(config.database);

  try {
    const reportolo_id = req.auth?.felhasznalo_id;
    if (!reportolo_id) {
      return res.status(401).json({ uzenet: "Nincs bejelentkezve" });
    }

    const poszt_id = Number(req.body.poszt_id);
    const indoklas_id = Number(req.body.indoklas_id);
    const report_szoveg = req.body.report_szoveg
      ? String(req.body.report_szoveg).trim()
      : "";

    // poszt létezik?
    const [pRows] = await connection.query<any[]>(
      "SELECT poszt_id FROM poszt WHERE poszt_id = ? LIMIT 1",
      [poszt_id]
    );
    if (!pRows || pRows.length === 0) {
      return res.status(404).json({ uzenet: "Nincs ilyen poszt" });
    }

    // indoklás létezik?
    const [iRows] = await connection.query<any[]>(
      "SELECT indoklas_id FROM indoklas WHERE indoklas_id = ? LIMIT 1",
      [indoklas_id]
    );
    if (!iRows || iRows.length === 0) {
      return res.status(400).json({ uzenet: "Érvénytelen indoklas_id" });
    }

    const [result] = await connection.query<any>(
      `INSERT INTO report (felhasznalo_id, poszt_id, report_szoveg, indoklas_id)
       VALUES (?, ?, ?, ?)`,
      [reportolo_id, poszt_id, report_szoveg, indoklas_id]
    );

    return res.status(201).json({
      uzenet: "OK",
      report_id: result.insertId
    });
  } catch {
    return res.status(500).json({ uzenet: "Szerver hiba" });
  } finally {
    await connection.end();
  }
}

export async function mentPoszt(req: Request, res: Response) {
  const connection = await mysql.createConnection(config.database);
  try {
    const felhasznalo_id = req.auth!.felhasznalo_id;
    const poszt_id = Number(req.params.poszt_id);

    // poszt létezik?
    const [p] = await connection.query<any[]>(
      "SELECT poszt_id FROM poszt WHERE poszt_id = ? LIMIT 1",
      [poszt_id]
    );
    if (p.length === 0) {
      return res.status(404).json({ uzenet: "Nincs ilyen poszt" });
    }

    // duplázás check
    const [dup] = await connection.query<any[]>(
      "SELECT 1 FROM elmentett_receptek WHERE felhasznalo_id = ? AND poszt_id = ? LIMIT 1",
      [felhasznalo_id, poszt_id]
    );
    if (dup.length > 0) {
      return res.status(409).json({ uzenet: "Már el van mentve" });
    }

    await connection.query(
      "INSERT INTO elmentett_receptek (felhasznalo_id, poszt_id) VALUES (?, ?)",
      [felhasznalo_id, poszt_id]
    );

    return res.status(201).json({ uzenet: "OK" });
  } catch {
    return res.status(500).json({ uzenet: "Szerver hiba" });
  } finally {
    await connection.end();
  }
}

export async function mentettPosztLevetel(req: Request, res: Response) {
  const connection = await mysql.createConnection(config.database);
  try {
    const felhasznalo_id = req.auth!.felhasznalo_id;
    const poszt_id = Number(req.params.poszt_id);


    const [result] = await connection.query<any>(
      "DELETE FROM elmentett_receptek WHERE felhasznalo_id = ? AND poszt_id = ?",
      [felhasznalo_id, poszt_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ uzenet: "Nem volt elmentve" });
    }

    return res.json({ uzenet: "OK" });
  } catch {
    return res.status(500).json({ uzenet: "Szerver hiba" });
  } finally {
    await connection.end();
  }
}

export async function getMentettPosztok(req: Request, res: Response) {
  const connection = await mysql.createConnection(config.database);
  try {
    const felhasznalo_id = req.auth!.felhasznalo_id;

    const [rows] = await connection.query<any[]>(
      "SELECT poszt_id FROM elmentett_receptek WHERE felhasznalo_id = ? ORDER BY poszt_id DESC",
      [felhasznalo_id]
    );

    return res.json(rows);
  } catch {
    return res.status(500).json({ uzenet: "Szerver hiba" });
  } finally {
    await connection.end();
  }
}







export async function getKonyha(_req: Request,res: Response) {
    const connection = await mysql.createConnection(config.database);

    try {
        const [eredmenysorok]: any = await connection.query(
            "SELECT konyha_id, konyha_nev FROM konyha ORDER BY konyha_nev ASC"
        );

        return res.status(200).json(eredmenysorok);
    } finally {
        await connection.end();
    }
}

export async function getFogas(_req: Request,res: Response) {
    const connection = await mysql.createConnection(config.database);

    try {
        const [eredmenysorok]: any = await connection.query(
            "SELECT fogas_id, fogas_nev FROM fogas ORDER BY fogas_nev ASC"
        );

        return res.status(200).json(eredmenysorok);
    } finally {
        await connection.end();
    }
}

export async function getSzezon(_req: Request,res: Response) {
    const connection = await mysql.createConnection(config.database);

    try {
        const [eredmenysorok]: any = await connection.query(
            //nev alapjan erdekes lenne
            "SELECT szezon_id, szezon_nev FROM szezon ORDER BY szezon_id ASC"
        );

        return res.status(200).json(eredmenysorok);
    } finally {
        await connection.end();
    }
}

export async function getPreferenciak(_req: Request,res: Response) {
    const connection = await mysql.createConnection(config.database);

    try {
        const [preferenciak]: any = await connection.query(
            "SELECT preferencia_id, preferencia_nev FROM preferenciak ORDER BY preferencia_nev ASC"
        );

        res.status(200).json(preferenciak);

    } finally {
        await connection.end();
    }
}


export async function getMertekegyseg(_req: Request, res: Response) {
    const connection = await mysql.createConnection(config.database);

    try {
        const [eredmenysorok]: any = await connection.query(
            "SELECT mertekegyseg_id, mertekegyseg_nev FROM mertekegyseg ORDER BY mertekegyseg_nev ASC"
        );

        return res.status(200).json(eredmenysorok);
    } finally {
        await connection.end();
    }
}

export async function getHozzavalok(_req: Request, res: Response) {
    const connection = await mysql.createConnection(config.database);

    try {
        const [eredmenysorok]: any = await connection.query(
            "SELECT hozzavalo_id, hozzavalo_nev FROM hozzavalok ORDER BY hozzavalo_nev ASC"
        );

        return res.status(200).json(eredmenysorok);
    } finally {
        await connection.end();
    }
}


export async function posztTorles(req: Request, res: Response) {
    const connection = await mysql.createConnection(config.database);
    
    try {
        const posztId = Number(req.params.id);
        const felhasznaloId = Number(req.body.felhasznalo_id);

        if (!posztId || !felhasznaloId) {
            return res.status(400).json({ uzenet: "Hiányzik a poszt_id vagy felhasznalo_id" });
        }

        const [check]: any = await connection.query(
            "SELECT felhasznalo_id FROM poszt WHERE poszt_id = ?",
            [posztId]
        );

        if (check.length === 0) {
            return res.status(404).json({ uzenet: "A poszt nem található" });
        }

        if (check[0].felhasznalo_id !== felhasznaloId) {
            return res.status(403).json({ uzenet: "Nincs jogosultságod ezt a posztot törölni" });
        }

        // poszthoz kapcsolódó adatok törlése
        await connection.query("DELETE FROM poszt_preferenciak WHERE poszt_id = ?", [posztId]);
        await connection.query("DELETE FROM poszt_hozzavalok WHERE poszt_id = ?", [posztId]);
        await connection.query("DELETE FROM komment WHERE poszt_id = ?", [posztId]);
        
        // poszt törlése (lepesek_id NULL lesz automatikusan ON DELETE SET NULL miatt)
        await connection.query("DELETE FROM poszt WHERE poszt_id = ?", [posztId]);

        return res.status(200).json({ uzenet: "A poszt sikeresen törölve" });
    } catch (error) {
        console.error("Hiba a poszt törlésénél:", error);
        return res.status(500).json({ uzenet: "Nem sikerült a posztot törölni" });
    } finally {
        await connection.end();
    }
}




