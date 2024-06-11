import { Router } from "express";
import { createAudience, getAudienceById, getAudiences, getCampaignLogs, startCampaign } from "../controllers/Audience.controller";
import { authenticateJWT } from "../middlewares/Auth.middleware";

const router = Router();

router.get('/', authenticateJWT, getAudiences);
  
router.post('/', authenticateJWT, createAudience);
  
router.get('/:id', authenticateJWT, getAudienceById);
  
router.post('/:id/startCampaign', authenticateJWT, startCampaign);
  
router.get('/:id/campaignLog', authenticateJWT, getCampaignLogs);

export default router;