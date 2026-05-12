import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductService } from './product.service';
import { ProductImageService } from '../product-image/product-image.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

class ProductDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsNumber()
  price!: number;

  @IsString()
  color!: string;

  @IsString()
  size!: string;

  @IsNumber()
  stock_quantity!: number;

  @IsNumber()
  category_id!: number;
}

class ProductUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsNumber()
  stock_quantity?: number;

  @IsOptional()
  @IsNumber()
  category_id?: number;
}

const productsUploadDir = join(process.cwd(), '..', 'uploads', 'products');
if (!existsSync(productsUploadDir)) {
  mkdirSync(productsUploadDir, { recursive: true });
}

const storage = diskStorage({
  destination: (_req, _file, cb) => cb(null, productsUploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${extname(file.originalname) || '.jpg'}`);
  },
});

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

  @ApiOperation({ summary: 'Create product' })
  @Post()
  async create(@Body() body: ProductDto) {
    return this.service.create(body);
  }

  @ApiOperation({ summary: 'Upload image for a product' })
  @Post(':id/images')
  @UseInterceptors(FileInterceptor('image', { storage }))
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      return { success: false, message: 'Image file is required' };
    }
    const imageUrl = `/uploads/products/${file.filename}`;
    return this.productImageService.addImage(id, imageUrl);
  }

  @ApiOperation({ summary: 'Update product' })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: ProductUpdateDto) {
    return this.service.update(id, body);
  }

  @ApiOperation({ summary: 'Delete product' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return { success: true };
  }
}
