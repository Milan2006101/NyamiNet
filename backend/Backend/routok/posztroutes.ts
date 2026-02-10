// ========== START: MODIFIED IMPORT FOR NAME-BASED INGREDIENT UPLOAD ==========
import { Router, Request, Response, NextFunction } from "express";
import { getSzurtPoszt, getReszletesPoszt , root, getKomment, hozzaadKomment, getFogas, getKonyha, getSzezon, likeolas,dislikeolas,ujPoszt, getfelhasznaloPreferenciak, PreferenciaKezeles, SotetMod, getPreferenciak, getMertekegyseg, getHozzavalok, posztTorles, ReportPoszt, getMentettPosztok, mentPoszt, mentettPosztLevetel } from "../controllerek/posztcontroller";
import { authRequired, authOptional } from "../middleware/auth";
import { handleMulterError } from "../middleware/kep";
import upload from "../config/multerConfig";


const router: Router = Router();

router.get('/', root)

// szűrt/etlen posztlista (GET/poszt?sorrend=2&allergia=vegetáriánus,vegán)
router.get('/poszt', authOptional, getSzurtPoszt);
 
router.get('/poszt/:id', getReszletesPoszt);

router.get("/komment/:posztid", getKomment);
//komment feltoltes
router.post("/komment", hozzaadKomment);

router.patch("/poszt/:id/like", likeolas);

router.patch("/poszt/:id/dislike", dislikeolas);

//poszt feltöltés képpel
router.post("/poszt", upload.single('kep'), handleMulterError, ujPoszt)

router.delete("/poszt/:id", posztTorles);

router.get("/felhasznalo/preferenciak", authRequired, getfelhasznaloPreferenciak);
router.post("/felhasznalo/preferenciak", authRequired, PreferenciaKezeles);

router.patch("/felhasznalo/:id/sotetmod", SotetMod)

router.post("/report", authRequired, ReportPoszt);

router.post("/mentett/:poszt_id", authRequired, mentPoszt);
router.delete("/mentett/:poszt_id", authRequired, mentettPosztLevetel);
router.get("/mentett", authRequired, getMentettPosztok);

router.get("/konyha", getKonyha);
router.get("/fogas", getFogas);
router.get("/szezon", getSzezon);
router.get("/preferenciak", getPreferenciak);
router.get("/mertekegyseg", getMertekegyseg);
router.get("/hozzavalok", getHozzavalok);

export default router;
