// API functions for authentication (register, login, create the API key)

import { API_BASE_URL } from "../config.js";

/**
 * Register a new user
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>}
 */

// This function registers a new user by sending their name, email, 
// and password to the server.
export async function registerUser(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      email,
      password
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "Registration failed");
  }

  return data;
}

/**
 * Log in as a user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>}
 */

// This function logs in a user by sending their email and password to the server.
export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "Login failed");
  }

  localStorage.setItem("token", data.data.accessToken);
  localStorage.setItem("user", data.data.name);

  return data;
}

// This function creates a new API key for the logged-in user by 
// sending a request to the server with the user's token for authentication.
export async function createApiKey() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/auth/create-api-key`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });

  const data = await response.json();

  console.log("Create API key response:", data);
  console.log("Create API key status:", response.status);

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "Failed to create API key");
  }

  const apiKey = data?.data?.key;

  if (!apiKey) {
    throw new Error("API key was not returned from server");
  }

  localStorage.setItem("apiKey", apiKey);

  console.log("Stored API key:", apiKey);

  return data;
}