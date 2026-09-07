import { useEffect, useState } from "react";
import Button from "../../components/Button.jsx";
import ProductList from "../../components/ProductList.jsx";
import {
  fetchProducts,
  fetchCategories,
} from "../../services/ProductService.js";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();

        setCategories(
          Array.isArray(response.data)
            ? response.data
            : response.data.categories || []
        );
      } catch (err) {
        console.error("Failed to load categories:", err);
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          limit: 100,
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        if (selectedCategory) {
          params.category = selectedCategory;
        }

        const response = await fetchProducts(params);
        const data = response.data;

        setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to load products:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load products."
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(loadProducts, 300);

    return () => clearTimeout(delay);
  }, [search, selectedCategory]);

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategory("");
  };

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
          Browse practical items for class, study, commute, and everyday
          campus routines.
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

        <div className="mb-8 rounded-3xl border-2 border-yellow-400 bg-zinc-200 p-4 sm:p-5">
          <div className="grid gap-4 md:grid-cols-[1fr_280px_auto] md:items-end">
            <div>
              <label
                htmlFor="product-search"
                className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-blue-950"
              >
                Search Products
              </label>

              <input
                id="product-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name or description..."
                className="w-full rounded-xl border-2 border-yellow-400 bg-white px-4 py-3 text-sm text-blue-950 outline-none transition placeholder:text-zinc-500 focus:ring-2 focus:ring-yellow-300"
              />
            </div>

            <div>
              <label
                htmlFor="product-category"
                className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-blue-950"
              >
                Category
              </label>

              <select
                id="product-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border-2 border-yellow-400 bg-white px-4 py-3 text-sm text-blue-950 outline-none transition focus:ring-2 focus:ring-yellow-300"
              >
                <option value="">All Categories</option>

                {categories.map((category) => (
                  <option
                    key={category._id}
                    value={category.categoryName}
                  >
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button
                type="button"
                onClick={handleClearFilters}
                disabled={!search && !selectedCategory}
                className="w-full rounded-xl border-2 border-yellow-400 bg-blue-950 px-5 py-3 text-sm font-bold text-yellow-400 transition hover:bg-yellow-400 hover:text-blue-950 disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
              >
                Clear
              </button>
            </div>
          </div>

          {(search || selectedCategory) && (
            <div className="mt-4 border-t-2 border-yellow-400 pt-4">
              <p className="text-xs font-semibold text-blue-950">
                Active filters:
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {search && (
                  <span className="rounded-full border-2 border-yellow-400 bg-yellow-400 px-3 py-1 text-xs font-semibold text-blue-950">
                    Search: {search}
                  </span>
                )}

                {selectedCategory && (
                  <span className="rounded-full border-2 border-yellow-400 bg-blue-950 px-3 py-1 text-xs font-semibold text-yellow-400">
                    Category: {selectedCategory}
                  </span>
                )}
              </div>
            </div>
          )}
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
          <div className="rounded-3xl border-2 border-yellow-400 bg-zinc-200 px-4 py-10 text-center">
            <p className="text-lg font-semibold text-blue-950">
              No products found.
            </p>

            {(search || selectedCategory) && (
              <>
                <p className="mt-2 text-sm text-zinc-600">
                  Try changing your search or category filter.
                </p>

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-5 rounded-xl border-2 border-yellow-400 bg-yellow-400 px-5 py-3 text-sm font-bold text-blue-950 transition hover:bg-yellow-300"
                >
                  Clear Filters
                </button>
              </>
            )}
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