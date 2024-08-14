document.getElementById("logout").addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:3004/api/logout", {
      method: "POST",
      credentials: "include",
      mode: "cors",
    });

    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Đăng xuất Thành Công",
        timer: 1500,
      });
      setTimeout(() => {
        window.location.href = "./index.html"; // Chuyển hướng tới trang đăng nhập
      }, 1000);
    } else {
      alert("Logout failed");
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
});
