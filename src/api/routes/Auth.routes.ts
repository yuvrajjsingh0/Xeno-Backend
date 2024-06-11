import { Router } from "express";
import { authenticateGoogleToken } from "../controllers/Auth.controller";

const router = Router();

router.post('/google', authenticateGoogleToken);

export default router;