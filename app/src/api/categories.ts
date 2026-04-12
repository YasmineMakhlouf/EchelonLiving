/**
 * categories
 * Frontend api module for Echelon Living app.
 */
import api from "./axios";

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};
