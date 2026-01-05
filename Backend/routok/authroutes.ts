import { Router } from "express";
import { regisztracio , bejelentkezes} from "../controllerek/authcontroller";

const router = Router();

router.post("/regisztracio", regisztracio);
router.post("/bejelentkezes", bejelentkezes); //az internet a post body-t ajadnlotta

export default router;