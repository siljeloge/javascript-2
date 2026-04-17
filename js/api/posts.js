// API functions for posts
import { API_BASE_URL } from "../config.js";

/**
 * Returns the headers needed for authenticated requests
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
 * Fetch all posts
 * @returns {Promise<object>}
 */
export async function getPosts() {
  const response = await fetch(
    `${API_BASE_URL}/social/posts?_author=true&_comments=true&_reactions=true`,
    {
      headers: getHeaders()
    }
  );

  const { data, errors } = await response.json();

  if (!response.ok) {
    throw new Error(errors?.[0]?.message || "Failed to fetch posts");
  }

  return { data };
}

/**
 * Fetch a single post by ID
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function getPostById(id) {
  const response = await fetch(
    `${API_BASE_URL}/social/posts/${id}?_author=true&_comments=true&_reactions=true`,
    {
      headers: getHeaders()
    }
  );

  const { data, errors } = await response.json();

  if (!response.ok) {
    throw new Error(errors?.[0]?.message || "Failed to fetch post");
  }

  return { data };
}

/**
 * Create a new post
 * @param {string} title
 * @param {string} body
 * @returns {Promise<object>}
 */
export async function createPost(title, body) {
  const response = await fetch(`${API_BASE_URL}/social/posts`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ title, body }) // 👈 destructured shorthand
  });

  const { data, errors } = await response.json();

  if (!response.ok) {
    throw new Error(errors?.[0]?.message || "Failed to create post");
  }

  return { data };
}

/**
 * Change a post
 * @param {string} id
 * @param {string} title
 * @param {string} body
 * @returns {Promise<object>}
 */
export async function updatePost(id, title, body) {
  const response = await fetch(`${API_BASE_URL}/social/posts/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ title, body }) // 👈 shorthand again
  });

  const { data, errors } = await response.json();

  if (!response.ok) {
    throw new Error(errors?.[0]?.message || "Failed to update post");
  }

  return { data };
}

/**
 * Delete a post
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deletePost(id) {
  const response = await fetch(`${API_BASE_URL}/social/posts/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });

  if (!response.ok) {
    const { errors } = await response.json(); // 👈 destructuring here too
    throw new Error(errors?.[0]?.message || "Failed to delete post");
  }
}