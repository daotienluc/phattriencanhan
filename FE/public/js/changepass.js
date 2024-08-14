document
  .getElementById("change-password")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Ngăn chặn hành động submit mặc định của form

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const username = localStorage.getItem("username");

    if (newPassword !== confirmPassword) {
      return Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Mật khẩu mới và mật khẩu xác nhận không khớp.",
      });
    }

    try {
      const response = await fetch(
        "http://localhost:3004/api/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, currentPassword, newPassword }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: result.message,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: result.message,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi, vui lòng thử lại.",
      });
    }
  });
