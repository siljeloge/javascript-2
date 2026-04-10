import { API_BASE_URL } from "../config.js";

/**
 * Returns headers for authenticated profile requests
 * @returns {object}
 */
function getHeaders() {
  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "X-Noroff-API-Key": apiKey
  };
}

/**
 * Fetch a profile by its username
 * @param {string} name
 * @returns {Promise<object>}
 */
export async function getProfile(name) {
  const response = await fetch(`${API_BASE_URL}/social/profiles/${name}`, {
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "Failed to fetch profile");
  }

  return data;
}

/**
 * Fetch all the posts by a specific user
 * @param {string} name
 * @returns {Promise<object>}
 */
export async function getProfilePosts(name) {
  const response = await fetch(
    `${API_BASE_URL}/social/profiles/${name}/posts?_author=true&_comments=true&_reactions=true`,
    {
      headers: getHeaders()
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "Failed to fetch profile posts");
  }

  return data;
}

/**
 * Follow a user
 * @param {string} name
 * @returns {Promise<object>}
 */
export async function followUser(name) {
  const response = await fetch(`${API_BASE_URL}/social/profiles/${name}/follow`, {
    method: "PUT",
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "Failed to follow user");
  }

  return data;
}

/**
 * Unfollow a user
 * @param {string} name
 * @returns {Promise<object>}
 */
export async function unfollowUser(name) {
  const response = await fetch(`${API_BASE_URL}/social/profiles/${name}/unfollow`, {
    method: "PUT",
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "Failed to unfollow user");
  }

  return data;
}