export interface TopSellingProduct {
  product_id: number;
  product_name: string;
  total_sold: number;
}

export interface AdminStatsSummary {
  total_users: number;
  total_orders: number;
  top_selling_products: TopSellingProduct[];
}
