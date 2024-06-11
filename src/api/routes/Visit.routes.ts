import { Router } from "express";
import { createVisit } from "../controllers/Visit.controller";

const router = Router();

router.post('/', createVisit);

export default router;