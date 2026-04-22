function login() {
  const user = document.getElementById("username").value;

  if (!user) return alert("Enter username");

  localStorage.setItem("user", user);
  window.location.href = "index.html";
}