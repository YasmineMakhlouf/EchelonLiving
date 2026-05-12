import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { CategoryService } from './category.service';

class CategoryDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get()
  async list() {
    return this.service.list();
  }

  @Post()
  async create(@Body() body: CategoryDto) {
    return this.service.create(body.name, body.description ?? '');
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: CategoryDto) {
    return this.service.update(id, body.name, body.description ?? '');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return { success: true };
  }
}
