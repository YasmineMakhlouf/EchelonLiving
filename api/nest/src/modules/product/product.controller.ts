import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductImageService } from '../product-image/product-image.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly service: ProductService,
    private readonly productImageService: ProductImageService,
  ) {}

  @ApiOperation({ summary: 'List products with optional filters' })
  @Get()
  async list(@Query() query: Record<string, string>) {
    return this.service.list(query);
  }

  @ApiOperation({ summary: 'Get images for a product' })
  @Get(':id/images')
  async getImages(@Param('id') id: string) {
    return this.productImageService.listForProduct(Number(id));
  }

  @ApiOperation({ summary: 'Get product by id' })
  @Get(':id')
  async get(@Param('id') id: string) {
    return this.service.getById(Number(id));
  }
}
