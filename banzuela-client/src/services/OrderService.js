import axios from "axios";
import constants from "../constants";

const ORDER_API = axios.create({
  baseURL: `${constants.HOST}/order`,
});

const authHeaders = () => {
  const token = localStorage.getItem("token");

  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

// Create order

export const checkoutCart = (
  userId,
  orderDetails
) => {
  return ORDER_API.post(
    "/",
    {
      user: userId,
      ...orderDetails,
    },
    authHeaders()
  );
};

// Get user's orders

export const fetchMyOrders = (userId) => {
  return ORDER_API.get(
    `/user/${userId}`,
    authHeaders()
  );
};

// Get all orders

export const fetchAllOrders = (
  params = {}
) => {
  return ORDER_API.get("/", {
    params,
    ...authHeaders(),
  });
};

// Get order by ID

export const fetchOrderById = (orderId) => {
  return ORDER_API.get(
    `/${orderId}`,
    authHeaders()
  );
};

// Dashboard orders

export const fetchDashboardOrders = (
  role,
  sellerId,
  params = {}
) => {
  return ORDER_API.get("/", {
    params: {
      ...params,
      role,
      sellerId:
        role === "seller"
          ? sellerId
          : undefined,
    },
    ...authHeaders(),
  });
};

// Update order status

export const updateOrderStatus = (
  orderId,
  status
) => {
  return ORDER_API.put(
    `/${orderId}`,
    {
      status,
    },
    authHeaders()
  );
};

// Cancel order

export const cancelOrder = (orderId) => {
  return ORDER_API.delete(
    `/${orderId}`,
    authHeaders()
  );
};
