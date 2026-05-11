import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

interface AuthUiState {
  loginEmail: string;
  loginPassword: string;
  loginSubmitting: boolean;
  loginError: string | null;
  registerName: string;
  registerEmail: string;
  registerPassword: string;
  registerSubmitting: boolean;
  registerError: string | null;
  registerFieldErrors: FieldErrors;
}

const initialState: AuthUiState = {
  loginEmail: '',
  loginPassword: '',
  loginSubmitting: false,
  loginError: null,
  registerName: '',
  registerEmail: '',
  registerPassword: '',
  registerSubmitting: false,
  registerError: null,
  registerFieldErrors: {},
};

const authUiSlice = createSlice({
  name: 'authUi',
  initialState,
  reducers: {
    setLoginEmail: (state, action: PayloadAction<string>) => {
      state.loginEmail = action.payload;
    },
    setLoginPassword: (state, action: PayloadAction<string>) => {
      state.loginPassword = action.payload;
    },
    setLoginSubmitting: (state, action: PayloadAction<boolean>) => {
      state.loginSubmitting = action.payload;
    },
    setLoginError: (state, action: PayloadAction<string | null>) => {
      state.loginError = action.payload;
    },
    resetLoginForm: (state) => {
      state.loginEmail = '';
      state.loginPassword = '';
      state.loginSubmitting = false;
      state.loginError = null;
    },
    setRegisterName: (state, action: PayloadAction<string>) => {
      state.registerName = action.payload;
    },
    setRegisterEmail: (state, action: PayloadAction<string>) => {
      state.registerEmail = action.payload;
    },
    setRegisterPassword: (state, action: PayloadAction<string>) => {
      state.registerPassword = action.payload;
    },
    setRegisterSubmitting: (state, action: PayloadAction<boolean>) => {
      state.registerSubmitting = action.payload;
    },
    setRegisterError: (state, action: PayloadAction<string | null>) => {
      state.registerError = action.payload;
    },
    setRegisterFieldErrors: (state, action: PayloadAction<FieldErrors>) => {
      state.registerFieldErrors = action.payload;
    },
    resetRegisterForm: (state) => {
      state.registerName = '';
      state.registerEmail = '';
      state.registerPassword = '';
      state.registerSubmitting = false;
      state.registerError = null;
      state.registerFieldErrors = {};
    },
  },
});

export const {
  setLoginEmail,
  setLoginPassword,
  setLoginSubmitting,
  setLoginError,
  resetLoginForm,
  setRegisterName,
  setRegisterEmail,
  setRegisterPassword,
  setRegisterSubmitting,
  setRegisterError,
  setRegisterFieldErrors,
  resetRegisterForm,
} = authUiSlice.actions;

export default authUiSlice.reducer;