// This script handles user login by capturing the form input and 
// sending it to the backend API.

import { loginUser, createApiKey } from "./api/auth.js";

const form = document.querySelector("#loginForm");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    try {
      const loginData = await loginUser(email, password);
      console.log("Login response:", loginData);

      const apiKeyData = await createApiKey();
      console.log("API key response:", apiKeyData);

      console.log("Stored token:", localStorage.getItem("token"));
      console.log("Stored apiKey:", localStorage.getItem("apiKey"));

      alert("Login wassuccessful!");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Login error:", error.message);
      alert(error.message);
    }
  });
}