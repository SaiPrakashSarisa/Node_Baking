function displayMenu() {
  const btn = document.getElementById("dropdown");

  if (btn.style.display === "none") {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
}
