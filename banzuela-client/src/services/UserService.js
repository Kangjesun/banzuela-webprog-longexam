import axios from "axios";
import constants from "../constants";

const API = axios.create({
  baseURL: `${constants.HOST}/user`,
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

// Users
export const fetchUsers = (params = {}) => {
  return API.get("/", {
    params,
    ...authHeaders(),
  });
};

export const fetchUserById = (id) => {
  return API.get(`/${id}`, authHeaders());
};

export const createUser = (user) => {
  return API.post("/register", {
    ...user,
    role: "customer",
    confirmPassword: user.password,
  });
};

export const updateUser = (id, user) => {
  return API.put(`/${id}`, user, authHeaders());
};

export const changePassword = (id, passwordData) => {
  return API.put(
    `/${id}/change-password`,
    passwordData,
    authHeaders()
  );
};

export const deleteUser = (id) => {
  return API.delete(`/${id}`, authHeaders());
};

// Authentication
export const loginUser = (credentials) => {
  return API.post("/login", credentials);
};
