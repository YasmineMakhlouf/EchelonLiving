import { Controller, Get, Param } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @Get(':productId')
  async list(@Param('productId') productId: string) {
    return this.service.listForProduct(Number(productId));
  }
}
