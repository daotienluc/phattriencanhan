document
  .getElementById("form-register")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3004/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
        mode: "cors",
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Đăng Ký Thành Công",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          window.location.href = "./login.html";
        }, 1000);
      } else if (response.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Username đã tồn tại",
        });
      } else {
        const data = await response.json();
        showMessage("Có Lỗi , Vui Lòng Thử Lại", true);
        console.error("Có Lỗi , Vui Lòng Thử Lại", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
