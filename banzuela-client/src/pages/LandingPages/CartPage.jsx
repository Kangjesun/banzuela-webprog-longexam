import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/Button";
import ProductImage from "../../components/ProductImage";
import { useAuth } from "../../context/AuthContext";

import {
  fetchCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../../services/CartService";

import { checkoutCart } from "../../services/OrderService";

const CartPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const userId = user?.id || user?._id;

  const [cart, setCart] = useState({
    items: [],
    totalPrice: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const [shippingAddress, setShippingAddress] = useState(
    user?.address || ""
  );

  const [useNewAddress, setUseNewAddress] = useState(
    !user?.address
  );

  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Load cart
  const loadCart = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetchCart(userId);

      const cartData =
        response.data?.cart ||
        response.data?.data || {
          items: [],
          totalPrice: 0,
        };

      setCart({
        items: Array.isArray(cartData.items)
          ? cartData.items
          : [],
        totalPrice: Number(cartData.totalPrice || 0),
      });
    } catch (requestError) {
      console.error("LOAD CART ERROR:", requestError);

      setError(
        requestError.response?.data?.message ||
          "Unable to load cart."
      );

      setCart({
        items: [],
        totalPrice: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [userId]);

  useEffect(() => {
    if (user?.address) {
      setShippingAddress(user.address);
      setUseNewAddress(false);
    } else {
      setShippingAddress("");
      setUseNewAddress(true);
    }
  }, [user?.address]);

  // Update quantity
  const handleQuantityChange = async (
    productId,
    quantity
  ) => {
    const nextQty = Number(quantity);

    if (!nextQty || nextQty < 1) return;
    if (!userId || !productId) return;

    try {
      setError("");

      const response = await updateCartQuantity(
        userId,
        productId,
        nextQty
      );

      const cartData =
        response.data?.cart ||
        response.data?.data;

      if (cartData) {
        setCart({
          items: Array.isArray(cartData.items)
            ? cartData.items
            : [],
          totalPrice: Number(
            cartData.totalPrice || 0
          ),
        });
      } else {
        await loadCart();
      }
    } catch (requestError) {
      console.error(
        "UPDATE QUANTITY ERROR:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to update quantity."
      );
    }
  };

  // Remove item
  const handleRemove = async (productId) => {
    if (!userId || !productId) return;

    try {
      setError("");

      const response = await removeFromCart(
        userId,
        productId
      );

      const cartData =
        response.data?.cart ||
        response.data?.data;

      if (cartData) {
        setCart({
          items: Array.isArray(cartData.items)
            ? cartData.items
            : [],
          totalPrice: Number(
            cartData.totalPrice || 0
          ),
        });
      } else {
        await loadCart();
      }
    } catch (requestError) {
      console.error(
        "REMOVE CART ITEM ERROR:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to remove item."
      );
    }
  };

  // Checkout
  const handleCheckout = async () => {
    if (!userId) {
      setCheckoutError("Please sign in again.");
      return;
    }

    if (user?.role !== "customer") {
      setCheckoutError(
        "Only customer accounts can checkout."
      );
      return;
    }

    if (!shippingAddress.trim()) {
      setCheckoutError(
        "Please provide a shipping address."
      );
      return;
    }

    if (!cart.items || cart.items.length === 0) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    try {
      setCheckoutError("");
      setError("");
      setCheckoutLoading(true);

      const orderItems = cart.items
        .map((item) => {
          const product = item.product;

          const productId =
            product?._id ||
            item.productId ||
            item.product;

          const quantity = Number(item.quantity || 1);

          const price = Number(
            item.price ??
              product?.price ??
              0
          );

          return {
            product: productId,
            quantity,
            price,
          };
        })
        .filter(
          (item) =>
            item.product &&
            item.quantity > 0
        );

      if (orderItems.length === 0) {
        setCheckoutError(
          "No valid products were found in your cart."
        );
        return;
      }

      const totalAmount = orderItems.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      );

      await checkoutCart({
        items: orderItems,
        totalAmount,
        shippingAddress:
          shippingAddress.trim(),
        paymentMethod,
      });

      try {
        await clearCart(userId);
      } catch (clearError) {
        console.error(
          "CLEAR CART ERROR:",
          clearError
        );
      }

      setCart({
        items: [],
        totalPrice: 0,
      });

      navigate("/orders");
    } catch (requestError) {
      console.error("CHECKOUT ERROR:", requestError);

      setCheckoutError(
        requestError.response?.data?.message ||
          "Unable to complete checkout."
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Not logged in
  if (!user) {
    return (
      <div className="flex w-full flex-col gap-6">
        <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-8">
          <div className="mx-auto max-w-5xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
              Shopping Cart
            </p>

            <h1 className="text-3xl font-bold text-white">
              Please sign in to view your cart.
            </h1>

            <Button
              to="/auth/signin"
              variant="primary"
              className="mt-6"
            >
              Sign In
            </Button>
          </div>
        </section>
      </div>
    );
  }

  // Customer only
  if (user.role !== "customer") {
    return (
      <div className="flex w-full flex-col gap-6">
        <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-8">
          <div className="mx-auto max-w-5xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
              Shopping Cart
            </p>

            <h1 className="text-3xl font-bold text-white">
              Only customer accounts can access the cart.
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

  // Loading
  if (loading) {
    return (
      <div className="flex w-full items-center justify-center p-12">
        <p className="text-lg font-semibold text-blue-900">
          Loading cart...
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
            Shopping Cart
          </p>

          <h1 className="max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl">
            Products added to your cart
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-7 text-yellow-100 sm:text-base">
            Review your selected products before
            continuing to checkout.
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

      <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
              Cart Items
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Your selected products
            </h2>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-400 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          )}

          {cart.items.length === 0 ? (
            <div className="rounded-2xl border-2 border-yellow-400 bg-blue-900/80 p-6">
              <p className="text-yellow-100">
                Your cart is empty.
              </p>

              <Button
                to="/products"
                variant="primary"
                className="mt-4"
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item, index) => {
                const product =
                  item.product || item;

                const productId =
                  product?._id ||
                  item.productId ||
                  item.product;

                const productName =
                  product?.productName ||
                  "Unavailable product";

                const productPrice = Number(
                  item.price ??
                    product?.price ??
                    0
                );

                const productStock =
                  product?.stock;

                return (
                  <article
                    key={productId || index}
                    className="flex flex-col gap-4 rounded-3xl border-2 border-yellow-400 bg-zinc-200 p-4 sm:flex-row"
                  >
                    <div className="h-32 w-full shrink-0 overflow-hidden rounded-2xl border-2 border-yellow-400 bg-zinc-100 sm:w-40">
                      <ProductImage
                        src={product?.image}
                        alt={productName}
                        width={160}
                        height={128}
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <h3 className="text-lg font-semibold text-zinc-900">
                        {productName}
                      </h3>

                      <p className="mt-2 font-bold text-blue-700">
                        PHP {productPrice.toFixed(2)}
                      </p>

                      <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
                        <label
                          htmlFor={`quantity-${productId}`}
                          className="text-sm text-zinc-900"
                        >
                          Quantity
                        </label>

                        <input
                          id={`quantity-${productId}`}
                          type="number"
                          min="1"
                          max={productStock || undefined}
                          value={item.quantity}
                          onChange={(event) =>
                            handleQuantityChange(
                              productId,
                              event.target.value
                            )
                          }
                          className="w-20 rounded-lg border-2 border-yellow-400 bg-blue-950 px-3 py-2 text-white outline-none focus:border-yellow-300"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(productId)
                          }
                          className="rounded-full border-2 border-yellow-400 bg-blue-900/95 px-4 py-2 text-xs font-semibold uppercase text-zinc-200 transition hover:text-yellow-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}

              <div className="border-t-2 border-yellow-400 pt-6 text-right">
                <p className="text-xl font-bold text-white">
                  Total:
                  <span className="ml-2 text-yellow-400">
                    PHP{" "}
                    {Number(
                      cart.totalPrice || 0
                    ).toFixed(2)}
                  </span>
                </p>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold text-yellow-400">
                  Shipping Address
                </p>

                {user.address && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUseNewAddress(false);
                        setShippingAddress(
                          user.address
                        );
                      }}
                      className={`rounded-full border-2 px-4 py-2 text-sm transition ${
                        !useNewAddress
                          ? "border-yellow-400 bg-yellow-400 text-blue-950"
                          : "border-yellow-400 bg-blue-900 text-yellow-100 hover:bg-yellow-400 hover:text-blue-950"
                      }`}
                    >
                      Registered address
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUseNewAddress(true);
                        setShippingAddress("");
                      }}
                      className={`rounded-full border-2 px-4 py-2 text-sm transition ${
                        useNewAddress
                          ? "border-yellow-400 bg-yellow-400 text-blue-950"
                          : "border-yellow-400 bg-blue-900 text-yellow-100 hover:bg-yellow-400 hover:text-blue-950"
                      }`}
                    >
                      New address
                    </button>
                  </div>
                )}

                {!useNewAddress && user.address ? (
                  <div className="mt-3 rounded-xl border-2 border-yellow-400 bg-zinc-200 px-4 py-3 text-sm text-zinc-900">
                    {user.address}
                  </div>
                ) : (
                  <textarea
                    id="shipping-address"
                    value={shippingAddress}
                    onChange={(event) =>
                      setShippingAddress(
                        event.target.value
                      )
                    }
                    rows="3"
                    placeholder="Enter your shipping address"
                    className="mt-3 w-full rounded-xl border-2 border-yellow-400 bg-zinc-200 px-4 py-3 text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-yellow-300"
                  />
                )}
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-yellow-400">
                  Payment Method
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {[
                    "Cash on Delivery",
                    "GCash",
                    "Credit Card",
                  ].map((method) => (
                    <label
                      key={method}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm transition ${
                        paymentMethod === method
                          ? "border-yellow-400 bg-yellow-400 text-blue-950"
                          : "border-yellow-400 bg-blue-900 text-yellow-100 hover:bg-yellow-400 hover:text-blue-950"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={
                          paymentMethod === method
                        }
                        onChange={(event) =>
                          setPaymentMethod(
                            event.target.value
                          )
                        }
                        className="h-4 w-4 accent-yellow-400"
                      />

                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {checkoutError && (
                <div className="mt-4 rounded-xl border border-red-400 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-700">
                    {checkoutError}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="mt-4 rounded-full border-2 border-yellow-400 bg-yellow-400 px-5 py-3 text-sm font-semibold text-blue-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkoutLoading
                  ? "Processing..."
                  : "Checkout"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CartPage;
