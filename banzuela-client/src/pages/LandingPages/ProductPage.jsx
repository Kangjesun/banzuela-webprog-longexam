import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Button from "../../components/Button.jsx";
import { fetchProductById } from "../../services/ProductService.js";
import { addToCart } from "../../services/CartService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import productImages from "../../assets/ProductImages.js";

const ProductPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setImageError(false);

        const response = await fetchProductById(id);
        const productData =
          response.data.product || response.data;

        setProduct(productData);
      } catch (err) {
        console.error("Failed to load product:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  useEffect(() => {
    setImageError(false);
  }, [product?._id]);

  const handleAddToCart = async () => {
    setMessage("");
    setError("");

    if (!user) {
      setError(
        "Please log in before adding products to your cart."
      );
      return;
    }

    if (user.role !== "customer") {
      setError(
        "Only buyer accounts can add products to the cart."
      );
      return;
    }

    if (!product?._id) {
      setError("Product information is missing.");
      return;
    }

    if (Number(product.stock) <= 0) {
      setError("This product is currently out of stock.");
      return;
    }

    try {
      setAdding(true);

      const response = await addToCart(
        user._id,
        product._id,
        1
      );

      console.log("Cart response:", response.data);

      setMessage("Product added to cart successfully!");
    } catch (err) {
      console.error("Add to cart error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to add product to cart."
      );
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center p-12">
        <p className="text-lg font-semibold text-zinc-700">
          Loading product...
        </p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="flex w-full flex-col gap-6">
        <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-white">
              Product not found
            </h1>

            <p className="mt-3 text-red-300">
              {error}
            </p>

            <Button
              to="/products"
              variant="primary"
              className="mt-6"
            >
              Back to Products
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const categoryName =
    typeof product.category === "object"
      ? product.category?.categoryName
      : product.category;

  const localProductImage =
    productImages[product.image] ||
    productImages[product.productName] ||
    "";

  const isNetworkImage =
    typeof product.image === "string" &&
    (product.image.startsWith("http://") ||
      product.image.startsWith("https://"));

  const productImage = isNetworkImage
    ? product.image
    : localProductImage;

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Button to="/products" variant="primary">
            Back to Products
          </Button>

          <p className="mb-3 mt-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
            {categoryName}
          </p>

          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
            {product.productName}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="text-2xl font-bold text-yellow-400">
              PHP {Number(product.price).toLocaleString()}
            </span>

            <span className="text-sm text-yellow-100">
              {Number(product.stock) > 0
                ? `${product.stock} available`
                : "Out of stock"}
            </span>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <div className="flex aspect-square items-center justify-center rounded-[1.25rem] border-2 border-yellow-400 bg-zinc-100 p-4">
            {productImage && !imageError ? (
              <img
                src={productImage}
                alt={product.productName}
                onError={() => setImageError(true)}
                className="h-full w-full rounded-[1.25rem] object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-zinc-200">
                <p className="text-sm text-zinc-500">
                  Product image unavailable
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
              Product Information
            </p>

            <h2 className="mt-3 text-2xl font-bold text-white">
              {product.productName}
            </h2>

            <p className="mt-6 text-base leading-7 text-yellow-100">
              {product.description}
            </p>

            {message && (
              <div className="mt-6 rounded-xl border border-green-400 bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-xl border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-8 border-t-2 border-yellow-400 pt-6">
              <p className="text-sm text-yellow-100">
                Price
              </p>

              <p className="mt-1 text-3xl font-bold text-yellow-400">
                PHP {Number(product.price).toLocaleString()}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {user?.role === "customer" && (
                <Button
                  variant="primary"
                  disabled={
                    adding || Number(product.stock) <= 0
                  }
                  onClick={handleAddToCart}
                >
                  {adding
                    ? "Adding..."
                    : Number(product.stock) <= 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                </Button>
              )}

              <Button to="/products">
                Back to Products
              </Button>
            </div>

            {!user && (
              <p className="mt-4 text-sm text-yellow-100">
                Please log in as a buyer to add this product
                to your cart.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
