import { Router } from "express";
import { regisztracio , bejelentkezes, jelszoValtoztatas} from "../controllerek/authcontroller";

const router = Router();

router.post("/regisztracio", regisztracio);
router.post("/bejelentkezes", bejelentkezes);

router.post("/jelszo-valtoztatas", jelszoValtoztatas);


export default router;