/**
 * events (routes)
 * Defines API endpoints and middleware for events resources.
 */
import { Router } from "express";
import CatalogEventsController from "../controllers/CatalogEventsController";

const router = Router();

router.get("/catalog", CatalogEventsController.stream);

export default router;
