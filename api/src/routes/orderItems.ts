/**
 * orderItems (routes)
 * Defines API endpoints and middleware for orderItems resources.
 */
import { Router } from "express";
import OrderItemController from "../controllers/OrderItemController";
import authMiddleware from "../middlewares/authMiddleware";
import asyncHandler from "../middlewares/asyncHandler";

const router = Router();

router.get("/order/:orderId", authMiddleware, asyncHandler(OrderItemController.getByOrderId));

export default router;

