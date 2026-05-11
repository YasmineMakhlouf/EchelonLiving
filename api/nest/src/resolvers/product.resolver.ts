import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Product, Category } from '../common/graphql.types';
import { ProductService } from '../modules/product/product.service';
import { CategoryService } from '../modules/category/category.service';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService, private readonly categoryService: CategoryService) {}

  @Query(() => [Product])
  async products() {
    try {
      return this.productService.list();
    } catch (error) {
      console.error('Products query error:', error);
      return [];
    }
  }

  @Query(() => Product, { nullable: true })
  async product(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.productService.getById(id);
    } catch (error) {
      console.error('Product query error:', error);
      return null;
    }
  }

  @Query(() => [Category])
  async categories() {
    try {
      return this.categoryService.list();
    } catch (error) {
      console.error('Categories query error:', error);
      return [];
    }
  }

  @Query(() => [Product])
  async productsByCategory(@Args('categoryId', { type: () => Int }) categoryId: number) {
    try {
      return this.productService.list({ categoryId });
    } catch (error) {
      console.error('Products by category query error:', error);
      return [];
    }
  }
}
