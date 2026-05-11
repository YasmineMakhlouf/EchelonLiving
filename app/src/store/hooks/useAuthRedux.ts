import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../index';
import { setUser, setToken, setError, clearAuth, setLoading } from '../slices/authSlice';
import { login as performLogin, register as performRegister } from '../../features/auth/services/authService';

export const useAuthRedux = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const error = useSelector((state: RootState) => state.auth.error);

  const login = async (email: string, password: string) => {
    dispatch(setLoading(true));
    try {
      const { user: nextUser, token: nextToken } = await performLogin({ email, password });
      dispatch(setUser(nextUser));
      dispatch(setToken(nextToken));
      dispatch(setError(null));
      return nextUser;
    } catch (err: any) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch(setLoading(true));
    try {
      const { user: nextUser, token: nextToken } = await performRegister({ name, email, password });
      dispatch(setUser(nextUser));
      dispatch(setToken(nextToken));
      dispatch(setError(null));
      return nextUser;
    } catch (err: any) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = () => {
    dispatch(clearAuth());
  };

  return { user, token, isLoading, error, login, register, logout };
};