// This script handles loading and displaying a single post and its details.

import { API_BASE_URL } from "./config.js";

// get post ID from the URL
const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

async function loadPost() {
  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");

  // Fetch post details with author, comments, and reactions
  try {
    const response = await fetch(
      `${API_BASE_URL}/social/posts/${postId}?_author=true&_comments=true&_reactions=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey
        }
      }
    );

    const result = await response.json();

    // Check for errors in the response
    if (!response.ok) {
      throw new Error(result.errors?.[0]?.message || "Failed to fetch post");
    }

    displayPost(result.data);

  } catch (error) {
    console.error(error.message);
  }
}

// Display post details in the DOM
function displayPost(post) {
  const container = document.querySelector("#post");

  container.innerHTML = `
    <h2>${post.title}</h2>
    <p>${post.body}</p>
    <small>Posted by ${post.author.name}</small>
  `;
}

loadPost();