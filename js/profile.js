// This script handles the loading and displaying user profiles, 
// including their posts and the follow/unfollow function.

import {
  getProfile,
  getProfilePosts,
  followUser,
  unfollowUser
} from "./api/profiles.js";

const params = new URLSearchParams(window.location.search);
const profileName = params.get("name") || localStorage.getItem("user");
const currentUser = localStorage.getItem("user");


async function loadProfilePage() {
  try {
    const profileResult = await getProfile(profileName);
    const postsResult = await getProfilePosts(profileName);

    displayProfile(profileResult.data);
    displayProfilePosts(postsResult.data);
  } catch (error) {
    console.error(error.message);
    alert(error.message);
  }
}

function displayProfile(profile) {
  const container = document.querySelector("#profile");
  const isOwnProfile = profile.name === currentUser;

  container.innerHTML = `
    <h2>${profile.name}</h2>
    <p>Followers: ${profile._count?.followers || 0}</p>
    <p>Following: ${profile._count?.following || 0}</p>
    <p>Posts: ${profile._count?.posts || 0}</p>
    ${
      !isOwnProfile
        ? `<button id="followToggleBtn">Follow / Unfollow</button>`
        : ""
    }
  `;

  if (!isOwnProfile) {
    const followToggleBtn = document.querySelector("#followToggleBtn");

    // Try to follow the user, if it fails (already following), try to unfollow
    followToggleBtn.addEventListener("click", async () => {
      try {
        await followUser(profile.name);
        await loadProfilePage();
      } catch (error) {
        try {
          await unfollowUser(profile.name);
          await loadProfilePage();
        } catch (secondError) {
          console.error(secondError.message);
          alert(secondError.message);
        }
      }
    });
  }
}

// Display the user's posts on their profile page
function displayProfilePosts(posts) {
  const container = document.querySelector("#userPosts");

  container.innerHTML = "<h3>User posts</h3>";

  if (!posts.length) {
    container.innerHTML += "<p>Nothing posted yet.</p>";
    return;
  }

  // Create post elements and add event listeners for viewing details
  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post-card");

    postElement.innerHTML = `
      <h4>${post.title}</h4>
      <p>${post.body}</p>
      <hr>
    `;

    postElement.addEventListener("click", () => {
      window.location.href = `post.html?id=${post.id}`;
    });

    container.appendChild(postElement);
  });
}

loadProfilePage();