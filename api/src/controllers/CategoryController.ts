/**
 * CategoryController
 * Manages CRUD endpoints for product categories.
 */
import { Request, Response } from "express";
import CategoryService from "../services/CategoryService";
import CatalogEventsService from "../services/CatalogEventsService";

class CategoryController {
  static async getAll(req: Request, res: Response): Promise<void> {
    const categories = await CategoryService.getAll();
    res.json(categories);
  }

  static async getById(req: Request, res: Response): Promise<void> {
    // Convert URL parameter to numeric id expected by the service layer.
    const id = Number(req.params.id);
    const category = await CategoryService.getById(id);
    res.json(category);
  }

  static async create(req: Request, res: Response): Promise<void> {
    const category = await CategoryService.create(req.body);
    // Broadcast changes so storefront subscribers can refresh category data.
    CatalogEventsService.emit("categories", "created");
    res.status(201).json(category);
  }

  static async update(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const category = await CategoryService.update(id, req.body);
    CatalogEventsService.emit("categories", "updated");
    res.json(category);
  }

  static async remove(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    await CategoryService.remove(id);
    CatalogEventsService.emit("categories", "deleted");
    res.status(204).send();
  }
}

export default CategoryController;

