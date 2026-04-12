export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name?: string;
  product_description?: string;
  product_color?: string;
  product_size?: string;
  product_category_name?: string;
}

export interface IOrderItemCreate {
  product_id: number;
  quantity: number;
  price: number;
}
