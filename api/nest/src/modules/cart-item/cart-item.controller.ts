import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('cart-items')
@Controller('cart-items')
export class CartItemController {
  constructor(private readonly service: CartItemService) {}

  @ApiOperation({ summary: 'List cart items for a user' })
  @Get(':userId')
  async list(@Param('userId') userId: string) {
    return this.service.listForUser(Number(userId));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add item to cart (authenticated)' })
  @Post()
  async add(@Body() body: any) {
    return this.service.add(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update cart item quantity (authenticated)' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(Number(id), body.quantity);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove item from cart (authenticated)' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
