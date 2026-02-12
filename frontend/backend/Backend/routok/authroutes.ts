import { Router } from "express";
import { regisztracio , bejelentkezes, jelszoValtoztatas} from "../controllerek/authcontroller";
import { authOptional } from "../middleware/auth";

const router = Router();

router.post("/regisztracio", authOptional, regisztracio);
router.post("/bejelentkezes", bejelentkezes);

router.post("/jelszo-valtoztatas", jelszoValtoztatas);


export default router;