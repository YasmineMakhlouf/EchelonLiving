import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type FilterState = {
  searchInput: string;
  minPriceInput: string;
  maxPriceInput: string;
  colorInput: string;
};

interface CatalogUiState {
  productsFilters: FilterState;
  categoryProductsFilters: FilterState;
}

const emptyFilters = (): FilterState => ({
  searchInput: '',
  minPriceInput: '',
  maxPriceInput: '',
  colorInput: '',
});

const initialState: CatalogUiState = {
  productsFilters: emptyFilters(),
  categoryProductsFilters: emptyFilters(),
};

const catalogUiSlice = createSlice({
  name: 'catalogUi',
  initialState,
  reducers: {
    setProductsSearchInput: (state, action: PayloadAction<string>) => {
      state.productsFilters.searchInput = action.payload;
    },
    setProductsMinPriceInput: (state, action: PayloadAction<string>) => {
      state.productsFilters.minPriceInput = action.payload;
    },
    setProductsMaxPriceInput: (state, action: PayloadAction<string>) => {
      state.productsFilters.maxPriceInput = action.payload;
    },
    setProductsColorInput: (state, action: PayloadAction<string>) => {
      state.productsFilters.colorInput = action.payload;
    },
    resetProductsFilters: (state) => {
      state.productsFilters = emptyFilters();
    },
    setCategorySearchInput: (state, action: PayloadAction<string>) => {
      state.categoryProductsFilters.searchInput = action.payload;
    },
    setCategoryMinPriceInput: (state, action: PayloadAction<string>) => {
      state.categoryProductsFilters.minPriceInput = action.payload;
    },
    setCategoryMaxPriceInput: (state, action: PayloadAction<string>) => {
      state.categoryProductsFilters.maxPriceInput = action.payload;
    },
    setCategoryColorInput: (state, action: PayloadAction<string>) => {
      state.categoryProductsFilters.colorInput = action.payload;
    },
    resetCategoryFilters: (state) => {
      state.categoryProductsFilters = emptyFilters();
    },
  },
});

export const {
  setProductsSearchInput,
  setProductsMinPriceInput,
  setProductsMaxPriceInput,
  setProductsColorInput,
  resetProductsFilters,
  setCategorySearchInput,
  setCategoryMinPriceInput,
  setCategoryMaxPriceInput,
  setCategoryColorInput,
  resetCategoryFilters,
} = catalogUiSlice.actions;

export default catalogUiSlice.reducer;