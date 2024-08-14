document
  .getElementById("form-login")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

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
        const data = await response.json();
        Swal.fire({
          icon: "success",
          title: "Đăng Nhập Thành Công",
          showConfirmButton: false,
          timer: 1500,
        });
        localStorage.setItem("username", username); // Lưu username
        localStorage.setItem("profileImage", data.profileImage); // Lưu username
        localStorage.setItem("name", data.name); // Lưu username
        localStorage.setItem("email", data.email); // Lưu username
        setTimeout(() => {
          window.location.href = "./logged.html"; // Đổi đường dẫn
        }, 1000);
      } else if (response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Tài khoản hoặc mật khẩu không đúng. Vui lòng thử lại.",
        });
      } else {
        const data = await response.json();
        Swal.fire({
          icon: "error",
          title: "Có Lỗi",
          text: "Vui Lòng Thử Lại",
        });
        console.error("Có Lỗi, Vui Lòng Thử Lại", data.message);
      }
    } catch (error) {
      // toastr.error("Error: " + error.message);
      console.error("Error:", error);
    }
  });
