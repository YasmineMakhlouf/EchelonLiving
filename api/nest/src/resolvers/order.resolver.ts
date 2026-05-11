import { Resolver, Mutation, Args, Int, Query } from '@nestjs/graphql';
import { Order, CartItem } from '../common/graphql.types';
import { OrderService } from '../modules/order/order.service';
import { CartItemService } from '../modules/cart-item/cart-item.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../modules/auth/jwt-auth.guard';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Order)
  async createOrder(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('total', { type: () => String }) total: string,
    @Args('status', { nullable: true }) status: string = 'pending',
  ) {
    try {
      return this.orderService.create({ user_id: userId, total });
    } catch (error) {
      console.error('Create order mutation error:', error);
      throw new Error(`Order creation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  @Query(() => [Order])
  async orderHistory(@Args('userId', { type: () => Int }) userId: number) {
    try {
      return this.orderService.getHistoryForUser(userId);
    } catch (error) {
      console.error('Order history query error:', error);
      return [];
    }
  }
}

@Resolver(() => CartItem)
export class CartResolver {
  constructor(private readonly cartService: CartItemService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CartItem)
  async addCartItem(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('productId', { type: () => Int }) productId: number,
    @Args('quantity', { type: () => Int, nullable: true }) quantity: number = 1,
  ) {
    try {
      return this.cartService.add({ user_id: userId, product_id: productId, quantity });
    } catch (error) {
      console.error('Add cart item mutation error:', error);
      throw new Error(`Cart item addition failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  @Query(() => [CartItem])
  async cartItems(@Args('userId', { type: () => Int }) userId: number) {
    try {
      return this.cartService.listForUser(userId);
    } catch (error) {
      console.error('Cart items query error:', error);
      return [];
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CartItem)
  async updateCartItem(@Args('id', { type: () => Int }) id: number, @Args('quantity', { type: () => Int }) quantity: number) {
    try {
      return this.cartService.update(id, quantity);
    } catch (error) {
      console.error('Update cart item error:', error);
      throw new Error(`Update failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async removeCartItem(@Args('id', { type: () => Int }) id: number) {
    try {
      const res = await this.cartService.remove(id);
      return !!res;
    } catch (error) {
      console.error('Remove cart item error:', error);
      throw new Error(`Remove failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
