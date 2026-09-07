import axios from "axios";
import constants from "../constants";

const CART_API = axios.create({
  baseURL: `${constants.HOST}/cart`,
});

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// GET CUSTOMER CART
export const fetchCart = (userId) =>
  CART_API.get(
    `/user/${userId}`,
    authHeaders()
  );

// ADD PRODUCT TO CART
export const addToCart = (
  userId,
  productId,
  quantity = 1
) =>
  CART_API.post(
    "/",
    {
      userId,
      productId,
      quantity,
    },
    authHeaders()
  );

// UPDATE CART ITEM QUANTITY
export const updateCartQuantity = (
  userId,
  productId,
  quantity
) =>
  CART_API.patch(
    `/user/${userId}/item/${productId}`,
    {
      quantity,
    },
    authHeaders()
  );

// REMOVE PRODUCT FROM CART
export const removeFromCart = (
  userId,
  productId
) =>
  CART_API.delete(
    `/user/${userId}/item/${productId}`,
    authHeaders()
  );

// CLEAR ENTIRE CART
export const clearCart = (userId) =>
  CART_API.delete(
    `/user/${userId}`,
    authHeaders()
  );