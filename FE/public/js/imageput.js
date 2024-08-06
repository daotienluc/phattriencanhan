document.addEventListener("DOMContentLoaded", function () {
  const profileImage = localStorage.getItem("profileImage");
  if (profileImage) {
    document.getElementById("preview-img").src = profileImage;
  }

  const username = localStorage.getItem("username");
  if (username) {
    document.getElementById("usernameDisplay").textContent = username;
  }
});

document
  .querySelector(".file-input")
  .addEventListener("change", async function (e) {
    const file = e.target.files[0];
    const username = localStorage.getItem("username"); // Lấy username từ localStorage

    if (file && username) {
      const formData = new FormData();
      formData.append("profileImage", file);
      formData.append("username", username); // Thêm thông tin username vào FormData

      try {
        const response = await fetch("http://localhost:3004/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          Swal.fire({
            icon: "success",
            title: "Ảnh đã được tải lên",
            text: `Đường dẫn ảnh: ${data.filePath}`,
            showConfirmButton: false,
            timer: 1500,
          });

          // Lưu đường dẫn ảnh vào localStorage
          localStorage.setItem("profileImage", data.filePath);

          // Cập nhật ảnh hiển thị
          document.getElementById("preview-img").src = data.filePath;
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi tải ảnh",
            text: "Vui lòng thử lại.",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi tải ảnh",
          text: "Có lỗi xảy ra, vui lòng thử lại.",
        });
      }
    } else if (!username) {
      Swal.fire({
        icon: "error",
        title: "Chưa đăng nhập",
        text: "Vui lòng đăng nhập để tải lên ảnh.",
      });
    }
  });
