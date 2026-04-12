export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: Date;
  product_name?: string;
  user_name?: string;
}

export interface IReviewCreate {
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
}

export interface IReviewUpdate {
  product_id?: number;
  user_id?: number;
  rating?: number;
  comment?: string;
}
