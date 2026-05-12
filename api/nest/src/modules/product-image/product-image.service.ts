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

  async addImage(productId: number, imageUrl: string) {
    const rows = await this.repo.query(
      'INSERT INTO product_images (product_id, image_url, created_at) VALUES ($1, $2, NOW()) RETURNING id, product_id, image_url, created_at',
      [productId, imageUrl],
    );
    return rows[0];
  }
}
