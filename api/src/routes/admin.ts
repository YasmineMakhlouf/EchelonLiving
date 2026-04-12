/**
 * admin (routes)
 * Defines API endpoints and middleware for admin resources.
 */
import { Router } from "express";
import AdminStatsController from "../controllers/AdminStatsController";
import authMiddleware from "../middlewares/authMiddleware";
import { requireAdmin } from "../middlewares/roleMiddleware";
import asyncHandler from "../middlewares/asyncHandler";

const router = Router();

router.get("/stats", authMiddleware, requireAdmin, asyncHandler(AdminStatsController.getSummary));

export default router;

