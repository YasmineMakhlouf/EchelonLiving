import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';

@Injectable()
export class ReviewService {
  constructor(private readonly repo: ReviewRepository) {}

  async listForProduct(productId: number) {
    return this.repo.query('SELECT id, user_id, rating, comment FROM reviews WHERE product_id = $1', [productId]);
  }
}
