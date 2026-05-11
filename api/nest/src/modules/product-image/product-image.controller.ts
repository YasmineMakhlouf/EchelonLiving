import { Controller, Get, Param } from '@nestjs/common';
import { ProductImageService } from './product-image.service';

@Controller('product-images')
export class ProductImageController {
  constructor(private readonly service: ProductImageService) {}

  @Get(':productId')
  async list(@Param('productId') productId: string) {
    return this.service.listForProduct(Number(productId));
  }
}
