import { Request, Response } from "express"
import mysql from "mysql2/promise"
import config from "./config"

export function root(_req: Request, res: Response) {
    res.send("Fut a szerver!")
}

//a posztokhoz hozzakell csatolni hogy a felahsznalo likol/dislekolta-e
export async function getSzurtPoszt(req: Request, res: Response) {
    const connection = await mysql.createConnection(config.database);
    await connection.query("SET NAMES utf8mb4 COLLATE utf8mb4_hungarian_ci"); //szarral csináltam
    try {
        const oldal = Number(req.query.oldal) || 1;
        const limit = Number(req.query.limit) || 10;

        const search = req.query.search ? String(req.query.search) : null;
        const ar = req.query.ar ? Number(req.query.ar) : null;
        const konyha = req.query.konyha ? String(req.query.konyha) : null;
        const fogas = req.query.fogas ? String(req.query.fogas) : null;
        const szezon = req.query.szezon ? String(req.query.szezon) : null;

        const ido = req.query.elkeszitesi_ido ? Number(req.query.elkeszitesi_ido) : 1;
        //datumszűrés, amennyi eltelt napon belül legyen a ma az 0
        const nap = req.query.nap ? Number(req.query.nap) : null;
        const nehezseg = req.query.nehezseg ? Number(req.query.nehezseg) : null;

        const allergia   = req.query.preferencia ? String(req.query.preferencia) : null;
        //1- random 2- ujabb elől 3- régebbi elől 4- legtöbb like elől
        const sorrend    = req.query.sorrend ? Number(req.query.sorrend) : 1;



        const [eredmenysorok]: any = await connection.query(
            "CALL get_szurt_posztok(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
                sorrend
            ]
        );

        res.status(200).json(eredmenysorok[0]);

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
            poszt_kepurl,
            felhasznalo_id,
            lepesek_szoveg,
            hozzavalok
        } = req.body;

        // nemlehetnek konstansok a split miatt
        let preferenciakString = String(req.body.preferenciak || null);
        let alcimekString = String(req.body.alcimek || null);

        let preferenciak = preferenciakString //"1, 2,  3 ,   4" --> ["1", "2", "3", "4"]

        .split(",")
        .map(x => x.trim())

        let alcimek = alcimekString
        .split(",")
        .map(x => x.trim())

        /*A HOZZAVALOK CSUNYAN JÖNNEK DE AZ EXPRESS ÁTALAKíTJA:
                hozzavalok[0][hozzavalo_id]=1
                hozzavalok[0][mennyiseg]=300
                hozzavalok[0][mertekegyseg_id]=1

                { hozzavalo_id: 1, mennyiseg: "300", mertekegyseg_id: 1 }
        */
        //problémázik a ts ezmiatt a h-nak a mapnál adni kell típust
        const hozzavalo_ids = hozzavalok.map((h: any) => h.hozzavalo_id).join(",");
        const mennyisegek   = hozzavalok.map((h: any) => h.mennyiseg).join(",");
        const mertekegyseg_ids = hozzavalok.map((h: any) => h.mertekegyseg_id).join(",");
        

        const [eredmeny]: any = await connection.query(
            "CALL uj_poszt_felvetele(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                poszt_cim,
                poszt_leiras,
                poszt_ido,
                poszt_adag,
                ar_id,
                konyha_id,
                fogas_id,
                nehezseg_id,
                szezon_id,
                poszt_kepurl,
                felhasznalo_id,
                lepesek_szoveg,

                hozzavalo_ids,
                mennyisegek,
                mertekegyseg_ids,
            ]
        );
        //kiveszem az id-t hogy tudjam befuzni a többit
        const ujPosztId = eredmeny[0][0].poszt_id;



        //TÖBBI ADATBÁZISBA FŰZÉS (a lépések id nem összekapcsolótáblás ezért van a procedureben)

        //preferenciak
        if (Array.isArray(preferenciak)) {
            for (const preferenciaId of preferenciak) {
                await connection.query(
                    "INSERT INTO poszt_preferenciak (poszt_id, preferencia_id) VALUES (?, ?)",
                    [ujPosztId, preferenciaId]
                );
            }
        }

        // alcimek
        if (Array.isArray(alcimek)) {
            const alcimSzoveg = alcimek.join(", ");
            await connection.query(
                "UPDATE poszt SET poszt_alcimek = ? WHERE poszt_id = ?",
                [alcimSzoveg, ujPosztId]
            );
        }

        //minden olyan, amit eddig futtattam most kerül be
        await connection.commit();

        res.status(201).json({
            uzenet: "poszt tétrejött",
            poszt_id: ujPosztId
        });

    } catch (hiba) {
        //valami szar visszavonja az egészet
        await connection.rollback();
    } finally {
        await connection.end();
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

export async function addKomment(req: Request, res: Response) {
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




