import { Router } from "express";
import { getSzurtPoszt, getReszletesPoszt , root, getKomment, hozzaadKomment, getFogas, getKonyha, getSzezon, likeolas, dislikeolas, getSzavazat, getLikeScore, ujPoszt, getfelhasznaloPreferenciak, PreferenciaKezeles, SotetMod, getPreferenciak, getMertekegyseg, getHozzavalok, posztTorles, ReportPoszt, getMentettPosztok, mentPoszt, mentettPosztLevetel } from "../controllerek/posztcontroller";
import { authRequired, authOptional } from "../middleware/auth";
import { handleMulterError } from "../middleware/kep";
import upload from "../config/multerConfig";


const router: Router = Router();

router.get('/', root)

router.get('/poszt', authOptional, getSzurtPoszt);
 
router.get('/poszt/:id', getReszletesPoszt);

router.get("/komment/:posztid", getKomment);
router.post("/komment", hozzaadKomment);

router.get("/poszt/:id/szavazat", authOptional, getSzavazat);
router.get("/poszt/:id/likescore", getLikeScore);
router.patch("/poszt/:id/like", authRequired, likeolas);
router.patch("/poszt/:id/dislike", authRequired, dislikeolas);

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
