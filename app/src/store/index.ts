import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import authUiReducer from './slices/authUiSlice';
import catalogUiReducer from './slices/catalogUiSlice';
import designStudioReducer from './slices/designStudioSlice';
import productReducer from './slices/productSlice';
import catalogDataReducer from './slices/catalogDataSlice';
import ordersDataReducer from './slices/ordersDataSlice';
import cartDataReducer from './slices/cartDataSlice';
import productDetailsReducer from './slices/productDetailsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    authUi: authUiReducer,
    catalogUi: catalogUiReducer,
    designStudio: designStudioReducer,
    product: productReducer,
    catalogData: catalogDataReducer,
    ordersData: ordersDataReducer,
    cartData: cartDataReducer,
    productDetails: productDetailsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;