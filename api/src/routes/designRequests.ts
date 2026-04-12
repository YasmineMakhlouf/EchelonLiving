/**
 * designRequests (routes)
 * Defines API endpoints and middleware for designRequests resources.
 */
import { Router } from "express";
import { createDesignRequestValidator, updateDesignRequestValidator } from "../validators/designRequestsValidator";
import authMiddleware from "../middlewares/authMiddleware";
import { requireAdmin } from "../middlewares/roleMiddleware";
import asyncHandler from "../middlewares/asyncHandler";
import DesignRequestController from "../controllers/DesignRequestController";
import validateRequest from "../middlewares/validateRequest";

const router = Router();

router.post("/", authMiddleware, createDesignRequestValidator, validateRequest, asyncHandler(DesignRequestController.create));
router.get("/", authMiddleware, requireAdmin, asyncHandler(DesignRequestController.index));
router.patch(
  "/:id",
  authMiddleware,
  requireAdmin,
  updateDesignRequestValidator,
  validateRequest,
  asyncHandler(DesignRequestController.updateStatus)
);

export default router;

