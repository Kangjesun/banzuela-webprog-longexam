import axios from "axios";
import constants from "../constants";

const REVIEW_API = axios.create({
  baseURL: `${constants.HOST}/review`,
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

export const fetchProductsToReview = (userId) => {
  return REVIEW_API.get(
    `/to-review/${userId}`,
    authHeaders()
  );
};

export const fetchMyReviews = (userId) => {
  return REVIEW_API.get(
    `/user/${userId}`,
    authHeaders()
  );
};

export const fetchReviewsByProduct = (productId) => {
  return REVIEW_API.get(
    `/product/${productId}`,
    authHeaders()
  );
};

export const createReview = (productId, reviewData) => {
  return REVIEW_API.post(
    `/${productId}`,
    reviewData,
    authHeaders()
  );
};

export const updateReview = (reviewId, reviewData) => {
  return REVIEW_API.put(
    `/${reviewId}`,
    reviewData,
    authHeaders()
  );
};

export const deleteReview = (reviewId) => {
  return REVIEW_API.delete(
    `/${reviewId}`,
    authHeaders()
  );
};

export const fetchAllReviews = (params = {}) => {
  return REVIEW_API.get("/", {
    params,
    ...authHeaders(),
  });
};

export const fetchReviewsBySeller = (sellerId, params = {}) => {
  return REVIEW_API.get(
    `/seller/${sellerId}`,
    {
      params,
      ...authHeaders(),
    }
  );
};
