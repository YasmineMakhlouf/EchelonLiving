export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  price_at_time?: number | string;
  price?: number | string;
  product_name?: string;
}

export interface ICartItemCreate {
  product_id: number;
  quantity: number;
}

export interface ICartItemUpdate {
  quantity: number;
}
