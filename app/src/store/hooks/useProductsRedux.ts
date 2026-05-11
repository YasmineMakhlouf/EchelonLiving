import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../index';
import { setProducts, setLoading, setError } from '../slices/productSlice';
import { getProducts } from '../../features/catalog/services/catalogService';

export const useProductsRedux = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.product.products);
  const isLoading = useSelector((state: RootState) => state.product.isLoading);
  const error = useSelector((state: RootState) => state.product.error);

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      dispatch(setLoading(true));

      try {
        const nextProducts = await getProducts();

        if (!active) {
          return;
        }

        dispatch(setProducts(nextProducts));
      } catch (fetchError) {
        if (!active) {
          return;
        }

        const message = fetchError instanceof Error ? fetchError.message : 'Failed to load products. Please try again.';
        dispatch(setError(message));
      } finally {
        if (active) {
          dispatch(setLoading(false));
        }
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, [dispatch]);

  return { products, isLoading, error };
};