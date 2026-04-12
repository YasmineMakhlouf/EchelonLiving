/**
 * orders (routes)
 * Defines API endpoints and middleware for orders resources.
 */
import { Router } from "express";
import OrderController from "../controllers/OrderController";
import authMiddleware from "../middlewares/authMiddleware";
import { requireRoles } from "../middlewares/roleMiddleware";
import asyncHandler from "../middlewares/asyncHandler";

const router = Router();

router.get("/history", authMiddleware, requireRoles("customer", "admin"), asyncHandler(OrderController.getOrderHistory));
router.get("/", authMiddleware, asyncHandler(OrderController.getMyOrders));
router.get("/:id", authMiddleware, asyncHandler(OrderController.getMyOrderById));
router.post("/", authMiddleware, asyncHandler(OrderController.createFromCart));

export default router;

