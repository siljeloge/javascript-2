// Logout function for all pages

const logoutBtn = document.querySelector("#logoutBtn");
const token = localStorage.getItem("token");

if (logoutBtn) {
  if (!token) {
    logoutBtn.style.display = "none";
  } else {
    logoutBtn.style.display = "block";

    // Clear localStorage and redirect to login page after clicking the logout button

    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });
  }
}