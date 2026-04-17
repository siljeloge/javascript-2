// This script handles user registration by capturing the form input and 
// sending it to the API.

import { registerUser } from "./api/auth.js";

const form = document.querySelector("form");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.querySelector("#username").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    try {
      await registerUser(name, email, password);

      alert("Registration was successful!");

    
      window.location.href = "login.html";

    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  });
}