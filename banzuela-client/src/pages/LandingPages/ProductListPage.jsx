import { useEffect, useState } from "react";
import Button from "../../components/Button.jsx";
import ProductList from "../../components/ProductList.jsx";
import { fetchProducts } from "../../services/ProductService.js";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetchProducts({
          limit: 100,
        });

        const data = response.data;

        setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to load products:", err);

        setError(
          err.response?.data?.message ||
          "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="flex w-full flex-col gap-6">

      <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
          Products
        </p>

        <h1 className="max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl">
          Shop campus essentials in a simple product grid
        </h1>

        <p className="mt-4 max-w-lg text-sm leading-7 text-yellow-100 sm:text-base">
          Browse practical items for class, study, commute, and everyday campus routines.
        </p>

        <div className="mt-6">
          <Button to="/" variant="primary">
            Back Home
          </Button>
        </div>

      </section>

      <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        <div className="mb-6">

          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
            Featured Products
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Product card grid
          </h2>

        </div>

        {loading && (
          <div className="py-10 text-center text-white">
            Loading products...
          </div>
        )}

        {error && (
          <div className="rounded-xl border-2 border-red-400 bg-red-50 px-4 py-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="py-10 text-center text-white">
            No products available.
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <ProductList products={products} />
        )}

      </section>

    </div>
  );
};

export default ProductListPage;