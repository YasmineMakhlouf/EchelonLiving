import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field()
  price!: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  color?: string;

  @Field({ nullable: true })
  image_url?: string;

  @Field({ nullable: true })
  category_name?: string;

  @Field(() => Int, { nullable: true })
  category_id?: number;

  @Field(() => Int, { nullable: true })
  stock_quantity?: number;
}

@ObjectType()
export class Category {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;
}

@ObjectType()
export class User {
  @Field(() => Int)
  id!: number;

  @Field()
  email!: string;

  @Field()
  role!: string;
}

@ObjectType()
export class AuthPayload {
  @Field(() => Int)
  id!: number;

  @Field()
  email!: string;

  @Field()
  role!: string;

  @Field({ nullable: true })
  token?: string;
}

@ObjectType()
export class Order {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  userId!: number;

  @Field()
  total!: string;

  @Field()
  status!: string;
  
  @Field(() => [OrderItem], { nullable: true })
  items?: OrderItem[];
}

@ObjectType()
export class CartItem {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  userId!: number;

  @Field(() => Int)
  productId!: number;

  @Field(() => Int)
  quantity!: number;
}

@ObjectType()
export class OrderItem {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  orderId!: number;

  @Field(() => Int)
  productId!: number;

  @Field(() => Int)
  quantity!: number;

  @Field({ nullable: true })
  price?: number;

  @Field({ nullable: true })
  product_name?: string;
}

@ObjectType()
export class DesignRequest {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  userId!: number;

  @Field()
  title!: string;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  designDataUrl!: string;

  @Field()
  status!: string;

  @Field({ nullable: true })
  adminNotes?: string;

  @Field()
  createdAt!: string;

  @Field({ nullable: true })
  reviewedAt?: string;
}
