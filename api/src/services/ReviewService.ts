/**
 * ReviewService
 * Handles review CRUD business rules.
 */
import ReviewRepository from "../repositories/ReviewRepository";
import { IReviewCreate, IReviewUpdate, Review } from "../types/review";
import { NotFoundError } from "../utils/errors";

class ReviewService {
  static async getAll(): Promise<Review[]> {
    return ReviewRepository.findAll();
  }

  static async getById(id: number): Promise<Review> {
    const review = await ReviewRepository.findById(id);
    if (!review) {
      throw new NotFoundError("Review not found");
    }
    return review;
  }

  static async create(reviewData: IReviewCreate): Promise<Review> {
    return ReviewRepository.create(reviewData);
  }

  static async update(id: number, reviewData: IReviewUpdate): Promise<Review> {
    const review = await ReviewRepository.update(id, reviewData);
    if (!review) {
      throw new NotFoundError("Review not found");
    }
    return review;
  }

  static async remove(id: number): Promise<boolean> {
    const deleted = await ReviewRepository.remove(id);
    if (!deleted) {
      throw new NotFoundError("Review not found");
    }
    return deleted;
  }
}

export default ReviewService;

