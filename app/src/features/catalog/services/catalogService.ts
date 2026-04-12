/**
 * catalogService
 * Catalog feature service: handles categories, products, filters, and images.
 */
import api from "../../../api/axios";
import { toAbsoluteImageUrl } from "../../../api/image";

export interface Category {
  id: number;
  name: string;
  description: string;
}

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

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
}

export interface ProductFilters {
  categoryId?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  color?: string;
}

export const getCategories = (): Promise<Category[]> => {
  return api.get<Category[]>("/categories")
    .then((res) => res.data)
    .catch((error) => {
      console.error("Failed to fetch categories:", error);
      throw new Error("Failed to load categories. Please try again.");
    });
};

export const getProducts = (filters?: ProductFilters): Promise<Product[]> => {
  const params: Record<string, string | number> = {};

  if (filters?.categoryId) {
    params.category_id = filters.categoryId;
  }
  if (filters?.search) {
    params.search = filters.search;
  }
  if (filters?.minPrice) {
    params.min_price = filters.minPrice;
  }
  if (filters?.maxPrice) {
    params.max_price = filters.maxPrice;
  }
  if (filters?.color) {
    params.color = filters.color;
  }

  return api.get<Product[]>("/products", {
    params: Object.keys(params).length > 0 ? params : undefined,
  })
    .then((res) => res.data)
    .catch((error) => {
      console.error("Failed to fetch products:", error);
      throw new Error("Failed to load products. Please try again.");
    });
};

export const getTrendingProducts = (): Promise<Product[]> => {
  return api.get<Product[]>("/products", {
    params: {
      sortBy: "popular",
      sortOrder: "DESC",
    },
  })
    .then((res) => res.data)
    .catch((error) => {
      console.error("Failed to fetch trending products:", error);
      throw new Error("Failed to load trending products. Please try again.");
    });
};

export const getProductById = (id: number): Promise<Product> => {
  return api.get<Product>(`/products/${id}`)
    .then((res) => res.data)
    .catch((error) => {
      console.error("Failed to fetch product:", error);
      throw new Error("Failed to load product. Please try again.");
    });
};

export const getProductImages = (productId: number): Promise<ProductImage[]> => {
  return api.get<ProductImage[]>(`/products/${productId}/images`)
    .then((res) => res.data)
    .catch((error) => {
      console.error("Failed to fetch product images:", error);
      return [];
    });
};

export const getCategoryImagesMap = (categories: Category[]): Promise<Record<number, string>> => {
  return Promise.all(
    categories.slice(0, 8).map((category) =>
      api.get<{ image_url?: string }[]>("/products", {
        params: {
          category_id: category.id,
          limit: 1,
        },
      })
        .then((response) => {
          const image = toAbsoluteImageUrl(response.data[0]?.image_url);
          return [category.id, image] as const;
        })
        .catch(() => [category.id, ""] as const)
    )
  )
    .then((imagePairs) => {
      const imageMap: Record<number, string> = {};
      imagePairs.forEach(([categoryId, image]) => {
        if (image) {
          imageMap[categoryId] = image;
        }
      });
      return imageMap;
    })
    .catch((error) => {
      console.error("Failed to load category images:", error);
      return {};
    });
};

export const getProductImagesMap = (productIds: number[]): Promise<Record<number, string>> => {
  const uniqueProductIds = [...new Set(productIds)];

  return Promise.all(
    uniqueProductIds.map((productId) =>
      api.get<ProductImage[]>(`/products/${productId}/images`)
        .then((response) => {
          const firstImage = response.data?.[0]?.image_url;
          const imageUrl = firstImage ? toAbsoluteImageUrl(firstImage) : "";
          return [productId, imageUrl] as const;
        })
        .catch(() => [productId, ""] as const)
    )
  )
    .then((imagePairs) => {
      const nextImages: Record<number, string> = {};
      imagePairs.forEach(([productId, image]) => {
        nextImages[productId] = image;
      });
      return nextImages;
    })
    .catch((error) => {
      console.error("Failed to load product images:", error);
      return {};
    });
};
