import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @ApiOperation({ summary: 'Get order history for a user' })
  @Get('history/:userId')
  async history(@Param('userId') userId: string) {
    return this.service.getHistoryForUser(Number(userId));
  }

  @ApiOperation({ summary: 'Get one order by id' })
  @Get(':id')
  async get(@Param('id') id: string) {
    return this.service.getById(Number(id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create an order (authenticated)' })
  @Post()
  async create(@Body() body: any) {
    return this.service.create(body);
  }
}
