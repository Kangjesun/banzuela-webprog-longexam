import { useEffect, useState } from "react";
import { Rating } from "@mui/material";

import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";

import {
  fetchProductsToReview,
  fetchMyReviews,
  createReview,
  updateReview,
} from "../../services/ReviewService";

import productImages from "../../assets/ProductImages.js";

const placeholderImage = "https://placehold.co/600x600";

const ReviewPage = () => {
  const { user } = useAuth();

  const userId = user?.id || user?._id;

  const [activeTab, setActiveTab] = useState("to-review");
  const [productsToReview, setProductsToReview] = useState([]);
  const [reviewHistory, setReviewHistory] = useState([]);
  const [forms, setForms] = useState({});
  const [editingReview, setEditingReview] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const getProductImage = (product) => {
    if (!product) {
      return placeholderImage;
    }

    if (product.image) {
      if (
        product.image.startsWith("http://") ||
        product.image.startsWith("https://") ||
        product.image.startsWith("data:")
      ) {
        return product.image;
      }

      if (productImages?.[product.image]) {
        return productImages[product.image];
      }
    }

    if (
      product.productName &&
      productImages?.[product.productName]
    ) {
      return productImages[product.productName];
    }

    if (product.image) {
      const imageEntry = Object.entries(productImages).find(
        ([key]) =>
          key.toLowerCase() ===
          String(product.image).toLowerCase()
      );

      if (imageEntry) {
        return imageEntry[1];
      }
    }

    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      const image = product.images[0];

      if (typeof image === "string") {
        if (productImages?.[image]) {
          return productImages[image];
        }

        return image;
      }
    }

    return placeholderImage;
  };

  const loadReviews = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [
        toReviewResponse,
        historyResponse,
      ] = await Promise.all([
        fetchProductsToReview(userId),
        fetchMyReviews(userId),
      ]);

      const toReviewData =
        toReviewResponse.data?.data ||
        toReviewResponse.data?.products ||
        toReviewResponse.data?.orders ||
        [];

      const historyData =
        historyResponse.data?.data ||
        historyResponse.data?.reviews ||
        [];

      setProductsToReview(
        Array.isArray(toReviewData)
          ? toReviewData
          : []
      );

      setReviewHistory(
        Array.isArray(historyData)
          ? historyData
          : []
      );
    } catch (requestError) {
      console.error(
        "LOAD REVIEWS ERROR:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to load reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      userId &&
      user?.role === "customer"
    ) {
      loadReviews();
    } else {
      setLoading(false);
    }
  }, [userId, user?.role]);

  const updateForm = (
    key,
    field,
    value
  ) => {
    setForms((current) => ({
      ...current,
      [key]: {
        rating: 5,
        comment: "",
        ...(current[key] || {}),
        [field]: value,
      },
    }));
  };

  const handleCreateReview = async (
    productId
  ) => {
    const form =
      forms[productId] || {
        rating: 5,
        comment: "",
      };

    if (!form.comment?.trim()) {
      setError(
        "Please write a comment before submitting."
      );
      return;
    }

    try {
      setError("");
      setMessage("");

      await createReview(
        productId,
        {
          rating: Number(form.rating),
          comment: form.comment.trim(),
        }
      );

      setMessage(
        "Review submitted successfully."
      );

      setForms((current) => {
        const updated = {
          ...current,
        };

        delete updated[productId];

        return updated;
      });

      await loadReviews();

      setActiveTab("history");
    } catch (requestError) {
      console.error(
        "CREATE REVIEW ERROR:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to submit review."
      );
    }
  };

  const handleUpdateReview = async (
    reviewId
  ) => {
    const form = forms[reviewId];

    if (!form?.comment?.trim()) {
      setError(
        "Please write a comment before saving."
      );
      return;
    }

    try {
      setError("");
      setMessage("");

      await updateReview(
        reviewId,
        {
          rating: Number(form.rating),
          comment: form.comment.trim(),
        }
      );

      setEditingReview(null);

      setMessage(
        "Review updated successfully."
      );

      await loadReviews();
    } catch (requestError) {
      console.error(
        "UPDATE REVIEW ERROR:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to update review."
      );
    }
  };

  if (
    !user ||
    user.role !== "customer"
  ) {
    return (
      <div className="flex w-full flex-col gap-6">
        <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <p className="mb-3 font-lexend text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
              My Reviews
            </p>

            <h1 className="font-lexend text-3xl font-bold text-white">
              Only buyer accounts can manage reviews.
            </h1>

            <Button
              to="/"
              variant="primary"
              className="mt-6"
            >
              Back Home
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center p-12">
        <p className="font-lexend text-lg font-semibold text-yellow-400">
          Loading reviews...
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">

      {/* HEADER */}
      <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="font-lexend text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
            My Reviews
          </p>

          <h1 className="mt-2 font-lexend text-3xl font-bold text-white sm:text-4xl">
            Review your purchases
          </h1>

          <p className="mt-4 max-w-xl font-lexend text-sm leading-7 text-yellow-100 sm:text-base">
            Share your experience with products you
            have purchased and received.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-4xl">

          {/* TABS */}
          <div className="flex flex-wrap gap-3 border-b-2 border-yellow-400 pb-3">
            <button
              type="button"
              onClick={() => {
                setActiveTab("to-review");
                setError("");
                setMessage("");
              }}
              className={`rounded-full border-2 px-4 py-2 font-lexend text-sm transition ${
                activeTab === "to-review"
                  ? "border-yellow-400 bg-yellow-400 text-blue-950"
                  : "border-yellow-400 bg-blue-900 text-yellow-100 hover:bg-yellow-400 hover:text-blue-950"
              }`}
            >
              To Review

              {productsToReview.length > 0 && (
                <span className="ml-2">
                  ({productsToReview.length})
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("history");
                setError("");
                setMessage("");
              }}
              className={`rounded-full border-2 px-4 py-2 font-lexend text-sm transition ${
                activeTab === "history"
                  ? "border-yellow-400 bg-yellow-400 text-blue-950"
                  : "border-yellow-400 bg-blue-900 text-yellow-100 hover:bg-yellow-400 hover:text-blue-950"
              }`}
            >
              Review History
            </button>
          </div>

          {/* MESSAGES */}
          {error && (
            <div className="mt-4 rounded-xl border-2 border-red-400 bg-red-50 px-4 py-3">
              <p className="font-lexend text-sm text-red-700">
                {error}
              </p>
            </div>
          )}

          {message && (
            <div className="mt-4 rounded-xl border-2 border-green-400 bg-green-50 px-4 py-3">
              <p className="font-lexend text-sm text-green-700">
                {message}
              </p>
            </div>
          )}

          {/* TO REVIEW */}
          {activeTab === "to-review" && (
            <div className="mt-6 space-y-5">
              {productsToReview.length === 0 ? (
                <div className="rounded-2xl border-2 border-yellow-400 bg-blue-900/80 p-6">
                  <h2 className="font-lexend text-lg font-semibold text-white">
                    No products to review
                  </h2>

                  <p className="mt-2 font-lexend text-sm text-yellow-100">
                    Products will appear here after
                    your order has been delivered.
                  </p>

                  <Button
                    to="/orders"
                    variant="primary"
                    className="mt-4"
                  >
                    View Orders
                  </Button>
                </div>
              ) : (
                productsToReview.map(
                  (item, index) => {
                    const product =
                      item?.product || item;

                    const productId =
                      product?._id ||
                      item?.productId;

                    if (!productId) {
                      return null;
                    }

                    const form =
                      forms[productId] || {
                        rating: 5,
                        comment: "",
                      };

                    return (
                      <article
                        key={`${productId}-${
                          item?.orderId || index
                        }`}
                        className="rounded-3xl border-2 border-yellow-400 bg-zinc-200 p-4 sm:p-5"
                      >
                        <div className="flex flex-col gap-5 sm:flex-row">

                          {/* IMAGE */}
                          <div className="h-40 w-full shrink-0 overflow-hidden rounded-2xl border-2 border-yellow-400 bg-zinc-100 sm:h-32 sm:w-40">
                            <img
                              src={getProductImage(
                                product
                              )}
                              alt={
                                product?.productName ||
                                "Product"
                              }
                              onError={(event) => {
                                event.currentTarget.onerror =
                                  null;
                                event.currentTarget.src =
                                  placeholderImage;
                              }}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          {/* PRODUCT */}
                          <div className="flex flex-1 flex-col">
                            <h2 className="font-lexend text-lg font-semibold text-zinc-900">
                              {product?.productName ||
                                "Product"}
                            </h2>

                            <p className="mt-2 font-lexend font-bold text-blue-700">
                              PHP{" "}
                              {Number(
                                product?.price || 0
                              ).toFixed(2)}
                            </p>

                            {item?.quantity && (
                              <p className="mt-1 font-lexend text-sm text-blue-700">
                                Quantity purchased:{" "}
                                {item.quantity}
                              </p>
                            )}

                            {/* RATING */}
                            <div className="mt-4">
                              <p className="mb-1 font-lexend text-sm text-zinc-900">
                                Your rating
                              </p>

                              <Rating
                                value={Number(
                                  form.rating
                                )}
                                onChange={(
                                  event,
                                  newValue
                                ) =>
                                  updateForm(
                                    productId,
                                    "rating",
                                    newValue || 1
                                  )
                                }
                                size="large"
                              />
                            </div>

                            {/* COMMENT */}
                            <textarea
                              value={
                                form.comment
                              }
                              onChange={(event) =>
                                updateForm(
                                  productId,
                                  "comment",
                                  event.target.value
                                )
                              }
                              rows="4"
                              placeholder="Write your review..."
                              className="mt-3 w-full resize-none rounded-xl border-2 border-yellow-400 bg-blue-950 p-3 font-lexend text-sm text-white placeholder:text-yellow-100/60 outline-none focus:border-yellow-300"
                            />

                            {/* SUBMIT */}
                            <button
                              type="button"
                              onClick={() =>
                                handleCreateReview(
                                  productId
                                )
                              }
                              className="mt-3 self-start rounded-full border-2 border-yellow-400 bg-yellow-400 px-5 py-2.5 font-lexend text-sm font-semibold text-blue-950 transition hover:bg-yellow-300"
                            >
                              Submit Review
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  }
                )
              )}
            </div>
          )}

          {/* REVIEW HISTORY */}
          {activeTab === "history" && (
            <div className="mt-6 space-y-5">
              {reviewHistory.length === 0 ? (
                <div className="rounded-2xl border-2 border-yellow-400 bg-blue-900/80 p-6">
                  <h2 className="font-lexend text-lg font-semibold text-white">
                    No review history
                  </h2>

                  <p className="mt-2 font-lexend text-sm text-yellow-100">
                    Your submitted reviews will appear
                    here.
                  </p>
                </div>
              ) : (
                reviewHistory.map((review) => {
                  const product =
                    review?.product;

                  const form =
                    forms[review._id] || {
                      rating:
                        review.rating || 5,
                      comment:
                        review.comment || "",
                    };

                  return (
                    <article
                      key={review._id}
                      className="rounded-3xl border-2 border-yellow-400 bg-zinc-200 p-4 sm:p-5"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row">

                        {/* IMAGE */}
                        <div className="h-40 w-full shrink-0 overflow-hidden rounded-2xl border-2 border-yellow-400 bg-zinc-100 sm:h-32 sm:w-40">
                          <img
                            src={getProductImage(
                              product
                            )}
                            alt={
                              product?.productName ||
                              "Product"
                            }
                            onError={(event) => {
                              event.currentTarget.onerror =
                                null;
                              event.currentTarget.src =
                                placeholderImage;
                            }}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* REVIEW */}
                        <div className="flex flex-1 flex-col">
                          <h2 className="font-lexend text-lg font-semibold text-zinc-900">
                            {product?.productName ||
                              "Product"}
                          </h2>

                          {editingReview ===
                          review._id ? (
                            <>
                              <div className="mt-4">
                                <p className="mb-1 font-lexend text-sm text-yellow-100">
                                  Your rating
                                </p>

                                <Rating
                                  value={Number(
                                    form.rating
                                  )}
                                  onChange={(
                                    event,
                                    newValue
                                  ) =>
                                    updateForm(
                                      review._id,
                                      "rating",
                                      newValue || 1
                                    )
                                  }
                                  size="large"
                                />
                              </div>

                              <textarea
                                value={
                                  form.comment
                                }
                                onChange={(event) =>
                                  updateForm(
                                    review._id,
                                    "comment",
                                    event.target.value
                                  )
                                }
                                rows="4"
                                className="mt-3 w-full resize-none rounded-xl border-2 border-yellow-400 bg-blue-950 p-3 font-lexend text-sm text-white outline-none focus:border-yellow-300"
                              />

                              <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateReview(
                                      review._id
                                    )
                                  }
                                  className="rounded-full border-2 border-yellow-400 bg-yellow-400 px-5 py-2.5 font-lexend text-sm font-semibold text-blue-950 transition hover:bg-yellow-300"
                                >
                                  Save Changes
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingReview(
                                      null
                                    )
                                  }
                                  className="rounded-full border-2 border-yellow-400 bg-blue-900 px-5 py-2.5 font-lexend text-sm font-semibold text-yellow-100 transition hover:bg-yellow-400 hover:text-blue-950"
                                >
                                  Cancel
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="mt-3">
                                <Rating
                                  value={Number(
                                    review.rating
                                  )}
                                  readOnly
                                  size="large"
                                />
                              </div>

                              <p className="mt-3 font-lexend leading-7 text-blue-700">
                                {review.comment ||
                                  "No comment provided."}
                              </p>

                              <p className="mt-3 font-lexend text-xs text-zinc-900">
                                Reviewed on{" "}
                                {review.createdAt
                                  ? new Date(
                                      review.createdAt
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </p>

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingReview(
                                    review._id
                                  );

                                  setForms(
                                    (current) => ({
                                      ...current,
                                      [review._id]: {
                                        rating:
                                          review.rating ||
                                          5,
                                        comment:
                                          review.comment ||
                                          "",
                                      },
                                    })
                                  );

                                  setError("");
                                  setMessage("");
                                }}
                                className="mt-4 self-start rounded-full border-2 border-yellow-400 bg-blue-900 px-5 py-2.5 font-lexend text-sm font-semibold text-yellow-100 transition hover:bg-yellow-400 hover:text-blue-950"
                              >
                                Edit Review
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ReviewPage;