import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";

import {
  fetchMyOrders,
  cancelOrder,
} from "../../services/OrderService";

import productImages from "../../assets/ProductImages.js";

const placeholderImage = "https://placehold.co/600x600";

const OrderPage = () => {
  const { user } = useAuth();

  const userId = user?.id || user?._id;

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
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

      if (productImages[product.image]) {
        return productImages[product.image];
      }
    }

    if (
      product.productName &&
      productImages[product.productName]
    ) {
      return productImages[product.productName];
    }

    return placeholderImage;
  };

  const loadOrders = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await fetchMyOrders(userId);

      const loadedOrders = Array.isArray(data)
        ? data
        : data?.orders || data?.data || [];

      const activeOrders = loadedOrders.filter(
        (order) =>
          order.status?.toLowerCase() !== "delivered"
      );

      setOrders(activeOrders);
    } catch (requestError) {
      console.error("LOAD ORDERS ERROR:", requestError);

      setError(
        requestError.response?.data?.message ||
          "Unable to load orders."
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && user?.role === "customer") {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [userId, user?.role]);

  const handleCancelOrder = async (orderId) => {
    try {
      setError("");

      await cancelOrder(orderId);

      await loadOrders();
    } catch (requestError) {
      console.error(
        "CANCEL ORDER ERROR:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to cancel order."
      );
    }
  };

  if (!user || user.role !== "customer") {
    return (
      <div className="flex w-full flex-col gap-6">
        <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <p className="mb-3 font-lexend text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
              Order Tracking
            </p>

            <h1 className="font-lexend text-3xl font-bold text-white">
              Only buyer accounts can view orders.
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
          Loading orders...
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
            Order Tracking
          </p>

          <h1 className="mt-2 font-lexend text-3xl font-bold text-white sm:text-4xl">
            My Orders
          </h1>

          <p className="mt-3 max-w-xl font-lexend text-sm leading-7 text-yellow-100 sm:text-base">
            Track your active orders. Once an order is
            delivered, it will appear in your Review page.
          </p>

          <div className="mt-6">
            <Button
              to="/products"
              variant="primary"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </section>

      {/* ORDERS */}
      <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {error && (
            <div className="mb-4 rounded-xl border-2 border-red-400 bg-red-50 px-4 py-3">
              <p className="font-lexend text-sm text-red-700">
                {error}
              </p>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="rounded-2xl border-2 border-yellow-400 bg-blue-900/80 p-6">
              <p className="font-lexend text-yellow-100">
                You have no active orders.
              </p>

              <Button
                to="/products"
                variant="primary"
                className="mt-4"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <article
                  key={order._id}
                  className="rounded-3xl border-2 border-yellow-400 bg-zinc-200 p-5"
                >
                  {/* ORDER HEADER */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-lexend font-semibold text-blue-700">
                      Order #{order._id.slice(-8)}
                    </h2>

                    <span
                      className={`rounded-full border-2 px-3 py-1 text-xs font-bold ${
                        order.status?.toLowerCase() ===
                        "cancelled"
                          ? "border-red-400 text-red-300"
                          : order.status?.toLowerCase() ===
                            "delivered"
                          ? "border-green-400 text-green-300"
                          : "border-blue-700 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* ORDER INFORMATION */}
                  <div className="mt-4 grid gap-3 font-lexend text-sm text-yellow-600 sm:grid-cols-2">
                    <p>
                      Payment method:{" "}
                      <span className="font-semibold text-zinc-900">
                        {order.paymentMethod}
                      </span>
                    </p>

                    <p>
                      Ordered on:{" "}
                      <span className="font-semibold text-zinc-900">
                        {order.orderDate
                          ? new Date(
                              order.orderDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </p>

                    <p className="sm:col-span-2">
                      Shipping address:{" "}
                      <span className="font-semibold text-zinc-900">
                        {order.shippingAddress}
                      </span>
                    </p>
                  </div>

                  {/* PRODUCTS */}
                  <div className="mt-5 border-t-2 border-yellow-400 pt-4">
                    <h3 className="font-lexend font-semibold text-yellow-600">
                      Products
                    </h3>

                    <div className="mt-3 space-y-3">
                      {order.items?.map((item, index) => {
                        const product = item.product;

                        const itemTotal =
                          Number(item.price || 0) *
                          Number(item.quantity || 0);

                        const imageUrl =
                          getProductImage(product);

                        return (
                          <div
                            key={`${order._id}-${
                              product?._id || index
                            }`}
                            className="flex gap-3 border-b border-yellow-400/50 pb-3"
                          >
                            {/* IMAGE */}
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-yellow-400 bg-zinc-100">
                              <img
                                src={imageUrl}
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

                            {/* DETAILS */}
                            <div className="flex flex-1 flex-col justify-center">
                              <p className="font-lexend font-semibold text-zinc-900">
                                {product?.productName ||
                                  "Unavailable product"}
                              </p>

                              <p className="mt-1 font-lexend text-sm text-blue-700">
                                Quantity: {item.quantity}
                              </p>

                              <p className="font-lexend text-sm text-blue-700">
                                PHP{" "}
                                {Number(
                                  item.price || 0
                                ).toFixed(2)}{" "}
                                each
                              </p>
                            </div>

                            {/* ITEM TOTAL */}
                            <p className="self-center font-lexend font-bold text-blue-700">
                              PHP{" "}
                              {itemTotal.toFixed(2)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div className="mt-5 border-t-2 border-yellow-400 pt-4 text-right">
                    <p className="font-lexend text-xl font-bold text-zinc-900">
                      Total:
                      <span className="ml-2 text-blue-700">
                        PHP{" "}
                        {Number(
                          order.totalAmount || 0
                        ).toFixed(2)}
                      </span>
                    </p>

                    {order.status?.toLowerCase() ===
                      "pending" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCancelOrder(
                            order._id
                          )
                        }
                        className="mt-4 rounded-full border-2 border-red-400 px-4 py-2 font-lexend text-sm font-semibold text-red-300 transition hover:bg-red-400 hover:text-white"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default OrderPage;