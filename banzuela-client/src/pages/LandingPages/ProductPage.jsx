import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";

import Button from "../../components/Button.jsx";
import { fetchProductById } from "../../services/ProductService.js";
import { addToCart } from "../../services/CartService.js";
import { fetchReviewsByProduct } from "../../services/ReviewService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import productImages from "../../assets/ProductImages.js";

const ProductPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [reviewsError, setReviewsError] = useState("");
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
    const loadReviews = async () => {
      try {
        setReviewsLoading(true);
        setReviewsError("");

        const response = await fetchReviewsByProduct(id);

        setReviews(response.data.reviews || []);
      } catch (err) {
        console.error("Failed to load reviews:", err);

        setReviewsError(
          err.response?.data?.message ||
            "Unable to load reviews."
        );

        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id) {
      loadReviews();
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
      <div className="flex min-h-screen w-full items-center justify-center bg-blue-950 p-12">
        <p className="text-lg font-semibold text-yellow-400">
          Loading product...
        </p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="flex min-h-screen w-full flex-col gap-6 bg-white">
        <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-8">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
              Product
            </p>

            <h1 className="mt-3 text-3xl font-bold text-white">
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

  const reviewCount = reviews.length;

  const averageRating =
    reviewCount > 0
      ? reviews.reduce(
          (total, review) =>
            total + Number(review.rating || 0),
          0
        ) / reviewCount
      : 0;

  const getReviewerName = (review) => {
    const reviewUser = review.user;

    if (!reviewUser) {
      return "Customer";
    }

    return (
      reviewUser.firstName ||
      reviewUser.name ||
      reviewUser.username ||
      "Customer"
    );
  };

  const formatReviewDate = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-6 bg-white">

      <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-5xl">

          <Button
            to="/products"
            variant="primary"
          >
            Back to Products
          </Button>

          <p className="mb-3 mt-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
            {categoryName || "Product"}
          </p>

          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
            {product.productName}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4">

            <span className="text-2xl font-bold text-yellow-400">
              PHP{" "}
              {Number(product.price).toLocaleString()}
            </span>

            <span className="text-sm text-yellow-100">
              {Number(product.stock) > 0
                ? `${product.stock} available`
                : "Out of stock"}
            </span>

            {reviewCount > 0 && !reviewsLoading && (
              <div className="flex items-center gap-2">

                <Rating
                  value={averageRating}
                  precision={0.1}
                  readOnly
                  size="small"
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: "#facc15",
                    },
                    "& .MuiRating-iconEmpty": {
                      color: "#facc15",
                    },
                  }}
                />

                <span className="text-sm text-yellow-100">
                  {averageRating.toFixed(1)} (
                  {reviewCount}{" "}
                  {reviewCount === 1
                    ? "review"
                    : "reviews"}
                  )
                </span>

              </div>
            )}

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
              <div className="flex h-full w-full items-center justify-center rounded-[1.25rem] bg-zinc-200">
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
                PHP{" "}
                {Number(product.price).toLocaleString()}
              </p>

            </div>

            <div className="mt-6 flex flex-wrap gap-3">

              {user?.role === "customer" && (
                <Button
                  variant="primary"
                  disabled={
                    adding ||
                    Number(product.stock) <= 0
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

      <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

          <div className="overflow-hidden rounded-3xl border-2 border-yellow-400 bg-zinc-200">

            <div className="flex flex-col gap-5 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-600">
                  Customer Reviews
                </p>

                <h2 className="mt-2 text-3xl font-bold text-blue-950">
                  Reviews for {product.productName}
                </h2>

                <p className="mt-2 text-sm text-blue-900/70">
                  See what customers think about this
                  product.
                </p>
              </div>

              {!reviewsLoading && reviewCount > 0 && (
                <div className="flex min-w-[190px] flex-col items-center rounded-2xl border-2 border-yellow-400 bg-white px-6 py-5">

                  <p className="text-4xl font-bold text-blue-950">
                    {averageRating.toFixed(1)}
                  </p>

                  <Rating
                    value={averageRating}
                    precision={0.1}
                    readOnly
                    sx={{
                      "& .MuiRating-iconFilled": {
                        color: "#facc15",
                      },
                      "& .MuiRating-iconEmpty": {
                        color: "#facc15",
                      },
                    }}
                  />

                  <p className="mt-1 text-sm font-medium text-blue-900">
                    {reviewCount}{" "}
                    {reviewCount === 1
                      ? "Review"
                      : "Reviews"}
                  </p>

                </div>
              )}

            </div>

            <div className="border-t-2 border-yellow-400">

              {reviewsLoading && (
                <div className="p-8 text-center">
                  <p className="font-medium text-blue-950">
                    Loading reviews...
                  </p>
                </div>
              )}

              {!reviewsLoading && reviewsError && (
                <div className="p-6">
                  <div className="rounded-2xl border-2 border-red-400 bg-red-50 px-5 py-4">

                    <p className="font-semibold text-red-700">
                      Unable to load reviews
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                      {reviewsError}
                    </p>

                  </div>
                </div>
              )}

              {!reviewsLoading &&
                !reviewsError &&
                reviewCount === 0 && (
                  <div className="p-8 text-center">

                    <p className="text-lg font-bold text-blue-950">
                      No reviews yet
                    </p>

                    <p className="mt-2 text-sm text-blue-900/70">
                      This product has not received any
                      customer reviews yet.
                    </p>

                  </div>
                )}

              {!reviewsLoading &&
                !reviewsError &&
                reviewCount > 0 && (
                  <div>

                    {reviews.map((review, index) => (
                      <div
                        key={review._id}
                        className={`p-5 sm:p-6 ${
                          index !== reviews.length - 1
                            ? "border-b-2 border-yellow-400"
                            : ""
                        }`}
                      >

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-yellow-600">
                              Customer
                            </p>

                            <h3 className="mt-1 text-lg font-bold text-blue-950">
                              {getReviewerName(review)}
                            </h3>
                          </div>

                          <div className="flex flex-col items-start sm:items-end">

                            <Rating
                              value={Number(review.rating)}
                              readOnly
                              size="small"
                              sx={{
                                "& .MuiRating-iconFilled": {
                                  color: "#facc15",
                                },
                                "& .MuiRating-iconEmpty": {
                                  color: "#facc15",
                                },
                              }}
                            />

                            {review.createdAt && (
                              <p className="mt-1 text-xs text-blue-900/60">
                                {formatReviewDate(
                                  review.createdAt
                                )}
                              </p>
                            )}

                          </div>

                        </div>

                        <p className="mt-4 text-sm leading-7 text-blue-950 sm:text-base">
                          {review.comment}
                        </p>

                      </div>
                    ))}

                  </div>
                )}

            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ProductPage;