// This script handles the index.html of the social media app, including displaying posts, 
// creating new posts, searchbar, and handling user interactions like editing and deleting posts.

import { getPosts, createPost, updatePost, deletePost } from "./api/posts.js";

// Redirect to login.html if I am not logged in
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

// The logout button in header
const logoutBtn = document.querySelector("#logoutBtn");

if (logoutBtn) {
  if (!token) {
    logoutBtn.style.display = "none";
  } else {
    logoutBtn.style.display = "block";

    // Clear localStorage and redirect to login page on logout
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });
  }
}

// Form submission (creat a post)
const form = document.querySelector("#createPostForm");
const searchInput = document.querySelector("#searchInput");

let allPosts = [];

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.querySelector("#postTitle").value.trim();
    const body = document.querySelector("#postBody").value.trim();

    if (!title || !body) {
      alert("Please enter both the title and body for the post.");
      return;
    }

    // Create the post and reload the posts list

    try {
      await createPost(title, body);
      form.reset();
      await loadPosts();
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  });
}

// Search function for filtering posts by title, body and author name
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.toLowerCase().trim();

    const filteredPosts = allPosts.filter((post) => {
      const title = post.title?.toLowerCase() || "";
      const body = post.body?.toLowerCase() || "";
      const author = post.author?.name?.toLowerCase() || "";

      // Check if the search value is included in title, body or author name

      return (
        title.includes(searchValue) ||
        body.includes(searchValue) ||
        author.includes(searchValue)
      );
    });

// Display the filtered posts 
    displayPosts(filteredPosts);
  });
}

// Load posts from the API and display them on the page
async function loadPosts() {
  try {
    const result = await getPosts();
    allPosts = result.data;
    displayPosts(allPosts);
  } catch (error) {
    console.error(error.message);
  }
}

// Display posts in the DOM with event listeners for viewing details, editing and deleting
function displayPosts(posts) {
  const container = document.querySelector("#posts");
  const currentUser = localStorage.getItem("user");


  container.innerHTML = "";

  // If no posts found, show a message
  if (!posts.length) {
    container.innerHTML = "<p>No posts found.</p>";
    return;
  }

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post-card");

    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.body}</p>
      <small class="author-link" data-name="${post.author.name}">
        By ${post.author.name}
      </small>
      ${
        post.author.name === currentUser
          ? `
            <br>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          `
          : ""
      }
      <hr>
    `;

    // Click on post to view details

    postElement.addEventListener("click", () => {
      window.location.href = `post.html?id=${post.id}`;
    });

    const authorLink = postElement.querySelector(".author-link");
    const editBtn = postElement.querySelector(".edit-btn");
    const deleteBtn = postElement.querySelector(".delete-btn");

    // Click on author name to view profile
    if (authorLink) {
      authorLink.addEventListener("click", (event) => {
        event.stopPropagation();
        const name = authorLink.dataset.name;
        window.location.href = `profile.html?name=${name}`;
      });
    }

    // Edit post and delete post on your own posts

    if (editBtn) {
      editBtn.addEventListener("click", async (event) => {
        event.stopPropagation();

        const newTitle = prompt("Edit title:", post.title);
        const newBody = prompt("Edit body:", post.body);

        if (!newTitle || !newBody) return;


        try {
          await updatePost(post.id, newTitle, newBody);
          await loadPosts();
        } catch (error) {
          console.error(error.message);
          alert(error.message);
        }
      });
    }

    // Delete post with confirmation
    if (deleteBtn) {
      deleteBtn.addEventListener("click", async (event) => {
        event.stopPropagation();

        const confirmed = confirm("Are you sure you want to delete this post?");
        if (!confirmed) return;


        try {
          await deletePost(post.id);
          await loadPosts();
        } catch (error) {
          console.error(error.message);
          alert(error.message);
        }
      });
    }

    container.appendChild(postElement);
  });
}

// Initial load of posts
loadPosts();