import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../../features/cart/services/cartService';

interface CartDataState {
  items: CartItem[];
  productImages: Record<number, string>;
  loading: boolean;
  error: string | null;
  checkoutLoading: boolean;
  checkoutMessage: string | null;
}

const initialState: CartDataState = {
  items: [],
  productImages: {},
  loading: false,
  error: null,
  checkoutLoading: false,
  checkoutMessage: null,
};

const cartDataSlice = createSlice({
  name: 'cartData',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    setProductImages: (state, action: PayloadAction<Record<number, string>>) => {
      state.productImages = { ...state.productImages, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCheckoutLoading: (state, action: PayloadAction<boolean>) => {
      state.checkoutLoading = action.payload;
    },
    setCheckoutMessage: (state, action: PayloadAction<string | null>) => {
      state.checkoutMessage = action.payload;
    },
  },
});

export const {
  setItems,
  setProductImages,
  setLoading,
  setError,
  clearError,
  setCheckoutLoading,
  setCheckoutMessage,
} = cartDataSlice.actions;

export default cartDataSlice.reducer;