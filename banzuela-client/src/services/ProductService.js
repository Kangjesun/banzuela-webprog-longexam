import axios from "axios";
import constants from "../constants";

const PRODUCT_API = axios.create({
  baseURL: `${constants.HOST}/v1/product`,
});

const CATEGORY_API = axios.create({
  baseURL: `${constants.HOST}/v1/category`,
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

// Products

export const fetchProducts = (params = {}) => {
  return PRODUCT_API.get("/", {
    params,
    ...authHeaders(),
  });
};

export const fetchProductById = (id) => {
  return PRODUCT_API.get(
    `/${id}`,
    authHeaders()
  );
};

export const createProduct = (product) => {
  return PRODUCT_API.post(
    "/",
    product,
    authHeaders()
  );
};

export const updateProduct = (id, product) => {
  return PRODUCT_API.put(
    `/${id}`,
    product,
    authHeaders()
  );
};

export const deleteProduct = (id) => {
  return PRODUCT_API.delete(
    `/${id}`,
    authHeaders()
  );
};

// Categories

export const fetchCategories = () => {
  return CATEGORY_API.get(
    "/",
    authHeaders()
  );
};
