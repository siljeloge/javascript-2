// Logout function for all pages

const logoutBtn = document.querySelector("#logoutBtn");
const token = localStorage.getItem("token");

if (logoutBtn) {
  if (!token) {
    logoutBtn.style.display = "none";
  } else {
    logoutBtn.style.display = "block";


    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });
  }
}