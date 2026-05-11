import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Review {
  id: number;
  product_id: number;
  user_id: number;
  user_name?: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  color?: string;
  image_url?: string;
  category_id?: number;
  category_name?: string;
  stock_quantity?: number;
}

interface ProductWithReviews extends Product {
  reviews?: Review[];
}

interface ProductDetailsState {
  product: ProductWithReviews | null;
  quantity: number;
  addingToCart: boolean;
  cartMessage: string;
}

const initialState: ProductDetailsState = {
  product: null,
  quantity: 1,
  addingToCart: false,
  cartMessage: '',
};

const productDetailsSlice = createSlice({
  name: 'productDetails',
  initialState,
  reducers: {
    setProduct: (state, action: PayloadAction<ProductWithReviews | null>) => {
      state.product = action.payload;
    },
    setQuantity: (state, action: PayloadAction<number>) => {
      if (state.product) {
        state.quantity = Math.min(
          Math.max(1, action.payload),
          state.product.stock_quantity ?? 1
        );
      }
    },
    setAddingToCart: (state, action: PayloadAction<boolean>) => {
      state.addingToCart = action.payload;
    },
    setCartMessage: (state, action: PayloadAction<string>) => {
      state.cartMessage = action.payload;
    },
    clearCartMessage: (state) => {
      state.cartMessage = '';
    },
    resetProductDetails: (state) => {
      state.product = null;
      state.quantity = 1;
      state.addingToCart = false;
      state.cartMessage = '';
    },
  },
});

export const {
  setProduct,
  setQuantity,
  setAddingToCart,
  setCartMessage,
  clearCartMessage,
  resetProductDetails,
} = productDetailsSlice.actions;

export default productDetailsSlice.reducer;