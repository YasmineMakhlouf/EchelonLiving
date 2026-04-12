import { OrderItem } from "./orderItem";

export interface Order {
  id: number;
  user_id: number;
  total_price: number;
  created_at: Date;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}
