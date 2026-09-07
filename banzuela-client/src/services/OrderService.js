import axios from "axios";
import constants from "../constants";

const ORDER_API = axios.create({
  baseURL: `${constants.HOST}/order`,
});

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
};

// Customer
export const checkoutCart = (orderDetails) =>
  ORDER_API.post("/", orderDetails, authHeaders());

export const fetchMyOrders = (userId) =>
  ORDER_API.get(`/user/${userId}`, authHeaders());

export const fetchOrderById = (orderId) =>
  ORDER_API.get(`/${orderId}`, authHeaders());

export const cancelOrder = (orderId) =>
  ORDER_API.delete(`/${orderId}/cancel`, authHeaders());

// Admin
export const fetchAllOrders = (params = {}) =>
  ORDER_API.get("/", { params, ...authHeaders() });

export const deleteOrder = (orderId) =>
  ORDER_API.delete(`/admin/${orderId}`, authHeaders());

// Admin / Seller
export const fetchDashboardOrders = (role, sellerId, params = {}) =>
  ORDER_API.get("/dashboard", {
    params: {
      ...params,
      role,
      sellerId: role === "seller" ? sellerId : undefined,
    },
    ...authHeaders(),
  });

export const updateOrderStatus = (orderId, status) =>
  ORDER_API.put(`/${orderId}`, { status }, authHeaders());
