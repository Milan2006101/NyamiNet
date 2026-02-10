import { Router } from "express";
import { requireAdmin } from "../middleware/admin";
import { authRequired } from "../middleware/auth";
import {
  userTiltasAllitas,
  getBejelentettPosztok,
  getBejelentesekPoszthoz,
  jovahagyBejelentettPoszt,
  torolBejelentettPoszt,
  torolBejelentettPosztEsTiltasPoszt,

} from "../controllerek/admincontroller";

const router = Router();

// BAN / UNBAN 
router.patch("/felhasznalo/:id/ban", authRequired, requireAdmin, userTiltasAllitas);

// Reportolt posztok (report_count szerint)
router.get("/report/poszt", authRequired, requireAdmin, getBejelentettPosztok);


router.get("/report/poszt/:poszt_id", authRequired, requireAdmin, getBejelentesekPoszthoz);

router.patch("/report/poszt/:poszt_id/jovahagy", authRequired, requireAdmin, jovahagyBejelentettPoszt);

// Reportolt poszt törlése (+ reportok törlése). Visszaad posztolo_id-t.
router.delete("/report/poszt/:poszt_id", authRequired, requireAdmin, torolBejelentettPoszt);

router.post("/report/poszt/:poszt_id/torlesban", authRequired, requireAdmin, torolBejelentettPosztEsTiltasPoszt);

export default router;
