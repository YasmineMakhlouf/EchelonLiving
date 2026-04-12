import { Request, Response } from "express";
import ReviewService from "../services/ReviewService";

/**
 * ReviewController
 * Handles CRUD endpoints for product reviews.
 */
class ReviewController {
  static async getAll(req: Request, res: Response): Promise<void> {
    const reviews = await ReviewService.getAll();
    res.json(reviews);
  }

  static async getById(req: Request, res: Response): Promise<void> {
    // Parse the path parameter before querying the service layer.
    const id = Number(req.params.id);
    const review = await ReviewService.getById(id);
    res.json(review);
  }

  static async create(req: Request, res: Response): Promise<void> {
    const review = await ReviewService.create(req.body);
    res.status(201).json(review);
  }

  static async update(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const review = await ReviewService.update(id, req.body);
    res.json(review);
  }

  static async remove(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    await ReviewService.remove(id);
    res.status(204).send();
  }
}

export default ReviewController;

