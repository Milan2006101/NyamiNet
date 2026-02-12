import { Router } from "express";
import { requireAdmin } from "../middleware/admin";
import { authRequired } from "../middleware/auth";
import {
  userTiltasAllitas,
  getBejelentettPosztok,
  getOsszesEgyeniReport,
  getBejelentesekPoszthoz,
  jovahagyBejelentettPoszt,
  torolBejelentettPoszt,
  torolBejelentettPosztEsTiltasPoszt,
} from "../controllerek/admincontroller";

const router = Router();

router.patch("/felhasznalo/:id/ban", authRequired, requireAdmin, userTiltasAllitas);

router.get("/report/osszes", authRequired, requireAdmin, getOsszesEgyeniReport);

router.get("/report/poszt", authRequired, requireAdmin, getBejelentettPosztok);


router.get("/report/poszt/:poszt_id", authRequired, requireAdmin, getBejelentesekPoszthoz);

router.patch("/report/poszt/:poszt_id/jovahagy", authRequired, requireAdmin, jovahagyBejelentettPoszt);

router.delete("/report/poszt/:poszt_id", authRequired, requireAdmin, torolBejelentettPoszt);

router.post("/report/poszt/:poszt_id/torlesban", authRequired, requireAdmin, torolBejelentettPosztEsTiltasPoszt);

export default router;
