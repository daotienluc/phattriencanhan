document
  .getElementById("form-login")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    function showMessage(message, isError = false) {
      const messageDiv = document.getElementById("message");
      messageDiv.textContent = message;
      messageDiv.classList.remove("hidden");
      messageDiv.style.backgroundColor = isError ? "#f44336" : "#4CAF50";

      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 1000);
    }

    try {
      const response = await fetch("http://localhost:3004/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        mode: "cors",
      });

      if (response.ok) {
        showMessage("Đăng Nhập Thành Công");
        localStorage.setItem("username", username); // Lưu username
        setTimeout(() => {
          window.location.href = "./logged.html"; // Đổi đường dẫn
        }, 1000);
      } else {
        const data = await response.json();
        showMessage("Có Lỗi, Vui Lòng Thử Lại", true);
        console.error("Có Lỗi, Vui Lòng Thử Lại", data.message);
      }
    } catch (error) {
      showMessage("Error: " + error.message, true);
      console.error("Error:", error);
    }
  });
