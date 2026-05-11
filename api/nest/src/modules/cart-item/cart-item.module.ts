import { Module } from '@nestjs/common';
import { CartItemController } from './cart-item.controller';
import { CartItemService } from './cart-item.service';
import { CartItemRepository } from './cart-item.repository';

@Module({
  controllers: [CartItemController],
  providers: [CartItemService, CartItemRepository],
  exports: [CartItemService],
})
export class CartItemModule {}
