export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  color: string;
  size: string;
  stock_quantity: number;
  category_id: number;
  created_at: Date;
  category_name?: string;
}

export interface ProductReview {
  id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: Date;
  user_name?: string;
}

export interface ProductWithReviews extends Product {
  reviews: ProductReview[];
}

export interface IProductCreate {
  name: string;
  description: string;
  price: number;
  color: string;
  size: string;
  stock_quantity: number;
  category_id: number;
}

export interface IProductUpdate {
  name?: string;
  description?: string;
  price?: number;
  color?: string;
  size?: string;
  stock_quantity?: number;
  category_id?: number;
}
