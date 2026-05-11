import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type BrushColor = '#111827' | '#f59e0b' | '#ec4899' | '#8b5cf6' | '#22c55e' | '#0ea5e9';

interface DesignStudioState {
  title: string;
  notes: string;
  brushColor: BrushColor;
  brushSize: number;
  submitting: boolean;
  error: string | null;
  successMessage: string | null;
  hasDrawing: boolean;
}

const initialState: DesignStudioState = {
  title: '',
  notes: '',
  brushColor: '#8b5cf6',
  brushSize: 10,
  submitting: false,
  error: null,
  successMessage: null,
  hasDrawing: false,
};

const designStudioSlice = createSlice({
  name: 'designStudio',
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },
    setBrushColor: (state, action: PayloadAction<BrushColor>) => {
      state.brushColor = action.payload;
    },
    setBrushSize: (state, action: PayloadAction<number>) => {
      state.brushSize = action.payload;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.submitting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccessMessage: (state, action: PayloadAction<string | null>) => {
      state.successMessage = action.payload;
    },
    setHasDrawing: (state, action: PayloadAction<boolean>) => {
      state.hasDrawing = action.payload;
    },
    resetDesignStudio: (state) => {
      state.title = '';
      state.notes = '';
      state.brushColor = '#8b5cf6';
      state.brushSize = 10;
      state.submitting = false;
      state.error = null;
      state.successMessage = null;
      state.hasDrawing = false;
    },
  },
});

export const {
  setTitle,
  setNotes,
  setBrushColor,
  setBrushSize,
  setSubmitting,
  setError,
  setSuccessMessage,
  setHasDrawing,
  resetDesignStudio,
} = designStudioSlice.actions;

export default designStudioSlice.reducer;