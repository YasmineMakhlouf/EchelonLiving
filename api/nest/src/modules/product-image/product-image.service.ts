import { Injectable } from '@nestjs/common';
import { ProductImageRepository } from './product-image.repository';

@Injectable()
export class ProductImageService {
  constructor(private readonly repo: ProductImageRepository) {}

  async listForProduct(productId: number) {
    return this.repo.query(
      'SELECT id, product_id, image_url, created_at FROM product_images WHERE product_id = $1 ORDER BY created_at DESC',
      [productId],
    );
  }
}
