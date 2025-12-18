import { Router } from "express";
import { getSzurtPoszt, getReszletesPoszt , root, getKomment, addKomment, getFogas, getKonyha, getSzezon, likeolas,dislikeolas,ujPoszt, getfelhasznaloPreferenciak, PreferenciaKezeles, SotetMod} from "./posztcontroller";

const router: Router = Router();

router.get('/', root)

// szűrt/etlen posztlista (GET/poszt?sorrend=2&allergia=vegetáriánus,vegán)
router.get('/poszt', getSzurtPoszt);

//reszletes posztnezet  
router.get('/poszt/:id', getReszletesPoszt);

//komment lekerdezes
router.get("/komment/:posztid", getKomment);
//komment feltoltes
router.post("/komment", addKomment);

//like
router.patch("/poszt/:id/like", likeolas);
//dislike
router.patch("/poszt/:id/dislike", dislikeolas);

//poszt feltöltés
router.post("/poszt", ujPoszt)

router.get("/felhasznalo/:id/preferenciak", getfelhasznaloPreferenciak)

router.post("/felhasznalo/:id/preferenciak", PreferenciaKezeles)

router.patch("/felhasznalo/:id/sotetmod", SotetMod)





router.get("/konyha", getKonyha);
router.get("/fogas", getFogas);
router.get("/szezon", getSzezon);
router.get("/preferenciak", getfelhasznaloPreferenciak)




export default router;
