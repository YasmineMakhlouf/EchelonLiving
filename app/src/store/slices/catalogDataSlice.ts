import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Product {
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

export interface Category {
  id: number;
  name: string;
  description?: string;
}

interface CatalogDataState {
  products: Product[];
  categories: Category[];
  productById: Record<number, Product>;
  categoryIdToProducts: Record<number, Product[]>;
  trending: Product[];
  loading: boolean;
  error: string | null;
  categoryImages: Record<number, string>;
  productImages: Record<number, string>;
}

const initialState: CatalogDataState = {
  products: [],
  categories: [],
  productById: {},
  categoryIdToProducts: {},
  trending: [],
  loading: false,
  error: null,
  categoryImages: {},
  productImages: {},
};

const catalogDataSlice = createSlice({
  name: 'catalogData',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      action.payload.forEach((product) => {
        state.productById[product.id] = product;
      });
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setTrending: (state, action: PayloadAction<Product[]>) => {
      state.trending = action.payload;
    },
    setCategoryImages: (state, action: PayloadAction<Record<number, string>>) => {
      state.categoryImages = action.payload;
    },
    addCategoryImages: (state, action: PayloadAction<Record<number, string>>) => {
      state.categoryImages = { ...state.categoryImages, ...action.payload };
    },
    setProductImages: (state, action: PayloadAction<Record<number, string>>) => {
      state.productImages = action.payload;
    },
    addProductImages: (state, action: PayloadAction<Record<number, string>>) => {
      state.productImages = { ...state.productImages, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setProducts,
  setCategories,
  setTrending,
  setCategoryImages,
  addCategoryImages,
  setProductImages,
  addProductImages,
  clearError,
} = catalogDataSlice.actions;

export default catalogDataSlice.reducer;