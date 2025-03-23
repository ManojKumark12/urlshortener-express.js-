import { Router } from "express";
import { postUrlShortner,getUrlshortener,redirect } from "../controller/postUrlShortener.js";
const router=Router();

router.get('/',getUrlshortener);
router.post('/',postUrlShortner);
router.get("/:shortcode",redirect);
export const route=router;