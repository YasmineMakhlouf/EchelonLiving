/**
 * Recommendations
 * Frontend UI components module for Echelon Living app.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import ProductCard from "./ProductCard";
import useCatalogRefresh from "../../hooks/useCatalogRefresh";
import "../../styles/components/Recommendations.css";

interface RecommendedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  color: string;
  size: string;
  stock_quantity: number;
  category_id: number;
  created_at: string;
  category_name?: string;
  image_url?: string;
}

interface RecommendationsProps {
  title?: string;
}

export default function Recommendations({ title = "Recommended for You" }: RecommendationsProps) {
  const navigate = useNavigate();
  const catalogRevision = useCatalogRefresh();
  const [products, setProducts] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get<RecommendedProduct[] | { data: RecommendedProduct[] }>(
          "/products/recommendations"
        );

        const payload = Array.isArray(response.data) ? response.data : response.data.data;
        setProducts(payload ?? []);
      } catch {
        setError("Failed to load recommendations.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [catalogRevision]);

  if (loading) {
    return (
      <section className="recommendations-section">
        <h2>{title}</h2>
        <p className="recommendations-state">Loading recommendations...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="recommendations-section">
        <h2>{title}</h2>
        <p className="recommendations-error">{error}</p>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="recommendations-section">
        <h2>{title}</h2>
        <p className="recommendations-state">No recommendations available yet.</p>
      </section>
    );
  }

  return (
    <section className="recommendations-section">
      <h2>{title}</h2>
      <div className="recommendations-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            color={product.color}
            image_url={product.image_url}
            category_name={product.category_name}
            description={product.description}
            stock_quantity={product.stock_quantity}
            onViewDetails={(productId) => navigate(`/products/${productId}`)}
          />
        ))}
      </div>
    </section>
  );
}
