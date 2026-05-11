import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { OrderWithItems } from '../../features/orders/services/ordersService';

interface OrdersDataState {
  orders: OrderWithItems[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersDataState = {
  orders: [],
  loading: false,
  error: null,
};

const ordersDataSlice = createSlice({
  name: 'ordersData',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<OrderWithItems[]>) => {
      state.orders = action.payload;
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
  },
});

export const {
  setOrders,
  setLoading,
  setError,
  clearError,
} = ordersDataSlice.actions;

export default ordersDataSlice.reducer;