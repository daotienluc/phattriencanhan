document.getElementById("logout").addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:3004/api/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      alert("Logout successful");
      window.location.href = "./index.html";
    } else {
      alert("Logout failed");
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
});
