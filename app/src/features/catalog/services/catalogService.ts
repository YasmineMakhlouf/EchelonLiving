/**
 * catalogService
 * Catalog feature service: handles categories, products, filters, and images.
 */
import api from "../../../api/axios";
import { graphqlRequest } from "../../../api/graphql";
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

interface CategoriesQueryData {
  categories: Array<{
    id: number;
    name: string;
  }>;
}

interface ProductsQueryData {
  products: Array<{
    id: number;
    name: string;
    description?: string | null;
    price: string;
    color?: string | null;
    image_url?: string | null;
    category_name?: string | null;
    category_id?: number | null;
    stock_quantity?: number | null;
  }>;
}

interface ProductsByCategoryQueryData {
  productsByCategory: Array<{
    id: number;
    name: string;
    description?: string | null;
    price: string;
    color?: string | null;
    image_url?: string | null;
    category_name?: string | null;
    category_id?: number | null;
    stock_quantity?: number | null;
  }>;
}

interface ProductQueryData {
  product: {
    id: number;
    name: string;
    description?: string | null;
    price: string;
    color?: string | null;
    image_url?: string | null;
    category_name?: string | null;
    category_id?: number | null;
    stock_quantity?: number | null;
  } | null;
}

const toNumberPrice = (value: string): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const mapProduct = (product: {
  id: number;
  name: string;
  description?: string | null;
  price: string;
  color?: string | null;
  image_url?: string | null;
  category_name?: string | null;
  category_id?: number | null;
  stock_quantity?: number | null;
}): Product => {
  return {
    id: product.id,
    name: product.name,
    description: product.description ?? undefined,
    price: toNumberPrice(product.price),
    color: product.color ?? undefined,
    image_url: product.image_url ?? undefined,
    category_name: product.category_name ?? undefined,
    category_id: product.category_id ?? undefined,
    stock_quantity: product.stock_quantity ?? undefined,
  };
};

const applyProductFilters = (products: Product[], filters?: ProductFilters): Product[] => {
  if (!filters) {
    return products;
  }

  const normalizedSearch = filters.search?.trim().toLowerCase();
  const normalizedColor = filters.color?.trim().toLowerCase();
  const minPrice = filters.minPrice ? Number(filters.minPrice) : null;
  const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;

  return products.filter((product) => {
    const productName = product.name.toLowerCase();
    const productDescription = (product.description ?? "").toLowerCase();
    const productColor = (product.color ?? "").toLowerCase();
    const productPrice = Number(product.price);

    if (normalizedSearch && !productName.includes(normalizedSearch) && !productDescription.includes(normalizedSearch)) {
      return false;
    }

    if (normalizedColor && !productColor.includes(normalizedColor)) {
      return false;
    }

    if (minPrice !== null && Number.isFinite(minPrice) && productPrice < minPrice) {
      return false;
    }

    if (maxPrice !== null && Number.isFinite(maxPrice) && productPrice > maxPrice) {
      return false;
    }

    return true;
  });
};

export const getCategories = (): Promise<Category[]> => {
  return graphqlRequest<CategoriesQueryData>(
    `
      query Categories {
        categories {
          id
          name
        }
      }
    `
  )
    .then((data) => data.categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: "",
    })))
    .catch((error) => {
      console.error("Failed to fetch categories:", error);
      throw new Error("Failed to load categories. Please try again.");
    });
};

export const getProducts = (filters?: ProductFilters): Promise<Product[]> => {
  const categoryId = filters?.categoryId ? Number(filters.categoryId) : null;
  const baseQuery = Number.isFinite(categoryId) && categoryId !== null
    ? graphqlRequest<ProductsByCategoryQueryData>(
      `
        query ProductsByCategory($categoryId: Int!) {
          productsByCategory(categoryId: $categoryId) {
            id
            name
            description
            price
            color
            image_url
            category_name
            category_id
            stock_quantity
          }
        }
      `,
      { categoryId }
    ).then((data) => data.productsByCategory)
    : graphqlRequest<ProductsQueryData>(
      `
        query Products {
          products {
            id
            name
            description
            price
            color
            image_url
            category_name
            category_id
            stock_quantity
          }
        }
      `
    ).then((data) => data.products);

  return baseQuery
    .then((products) => products.map(mapProduct))
    .then((products) => applyProductFilters(products, filters))
    .catch((error) => {
      console.error("Failed to fetch products:", error);
      throw new Error("Failed to load products. Please try again.");
    });
};

export const getTrendingProducts = (): Promise<Product[]> => {
  return graphqlRequest<ProductsQueryData>(
    `
      query Products {
        products {
          id
          name
          description
          price
          color
          image_url
          category_name
          category_id
          stock_quantity
        }
      }
    `
  )
    .then((data) => data.products.map(mapProduct))
    .then((products) => products.slice(0, 8))
    .catch((error) => {
      console.error("Failed to fetch trending products:", error);
      throw new Error("Failed to load trending products. Please try again.");
    });
};

export const getProductById = (id: number): Promise<Product> => {
  return graphqlRequest<ProductQueryData>(
    `
      query Product($id: Int!) {
        product(id: $id) {
          id
          name
          description
          price
          color
          image_url
          category_name
          category_id
          stock_quantity
        }
      }
    `,
    { id }
  )
    .then((data) => {
      if (!data.product) {
        throw new Error("Product not found.");
      }

      return mapProduct(data.product);
    })
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
