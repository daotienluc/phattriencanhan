let currentPage = 1;
const limit = 5; // Số lượng bài viết trên mỗi trang

document.addEventListener("DOMContentLoaded", async function () {
  await fetchPosts(currentPage);

  document
    .getElementById("postForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const postTitle = document.getElementById("postTitle").value;
      const postContent = document.getElementById("postContent").value;
      const username = localStorage.getItem("username");

      if (username) {
        document.getElementById(
          "usernameDisplay"
        ).textContent = `Welcome, ${username}`;
      }

      try {
        const response = await fetch("http://localhost:3004/api/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postTitle, postContent, username }),
          mode: "cors",
        });

        if (response.status === 202) {
          Swal.fire({
            icon: "success",
            title: "Đăng bài thành công",
            showConfirmButton: false,
            timer: 1200,
          });
          document.getElementById("postForm").reset();
          await fetchPosts(currentPage);
        } else {
          Swal.fire({
            icon: "error",
            title: "Đăng bài thất bại",
            text: "Vui lòng thử lại sau.",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Đã xảy ra lỗi",
          text: "Vui lòng thử lại sau.",
        });
      }
    });
});

async function fetchPosts(page) {
  try {
    const response = await fetch(
      `http://localhost:3004/api/posts?page=${page}&limit=${limit}`
    );
    const data = await response.json();
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";

    const username = localStorage.getItem("username");

    // const profileImage = post.profileImage || './img/user.jpg';
    // const profileImage = localStorage.setItem('profileImage') || './img/user.jpg';

    for (const post of data) {
      const postDiv = document.createElement("div");
      postDiv.classList.add("post");

      postDiv.innerHTML = `
                <div class="blog shadow" data-id="${post.id}">
                    <div class="blog_user">
                        <div class="avata_user">
                            <img id="preview-img" src="${
                              post.profileImage || "./img/user.jpg"
                            }" alt="profileImage" /> 
                        </div>
                        <p>${post.username}</p>
                    </div>
                    <div class="blog_Tiltle">
                        <h2>${post.postTitle}</h2>
                    </div>
                    <div class="blog_content">
                        <p>${post.postContent}</p>
                    </div>
                    <div class="blog_icon">
                        <ul class="d-flex justify-content-around">
                            <li class="like-btn">
                                <button class="btn-like">
                                    <i class="fa-solid fa-thumbs-up"></i>
                                    Thích
                                    <span class="like-count">${
                                      post.likeCount || 0
                                    }</span>
                                </button>
                            </li>
                            <li></li>
                            <li class="comment-btn">
                                <button class="btn-comment">
                                    <i class="fa-solid fa-comment"></i>
                                    Bình luận
                                    <span class="comment-count">${
                                      post.commentCount || 0
                                    }</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div class="blog_comment d-flex" style="display: none;">
                        <div class="comment_user">
                           <img id="preview-img" src="./img/user.jpg" alt="profileImage" />
                        </div>
                        <input class="user-comment-btn" type="text" placeholder="Bình luận với vai trò user" />
                        <button class="submit-comment-btn">Gửi</button>
                    </div>
                    <div class="comments-container" style="display: none;">
                        <!-- Các bình luận sẽ được thêm vào đây -->
                    </div>
                </div>
            `;

      postsContainer.appendChild(postDiv);

      // Kiểm tra trạng thái like của bài viết
      if (username) {
        try {
          const likeResponse = await fetch(
            `http://localhost:3004/api/posts/${post.id}/like-status?username=${username}`
          );
          const likeData = await likeResponse.json();
          const likeButton = postDiv.querySelector(".like-btn button");
          if (likeData.liked) {
            likeButton.classList.add("liked");
          } else {
            likeButton.classList.remove("liked");
          }
        } catch (error) {
          console.error("Error fetching like status:", error);
        }
      }
    }

    // Add event listeners for like buttons
    const likeButtons = document.querySelectorAll(".like-btn button");
    likeButtons.forEach((button) => {
      button.addEventListener("click", async function () {
        const blogShadow = button.closest(".blog.shadow");
        const likeCountSpan = blogShadow.querySelector(".like-count");
        const postId = blogShadow.getAttribute("data-id");
        const username = localStorage.getItem("username");

        if (!username) {
          Swal.fire({
            icon: "error",
            title: "Bạn cần đăng nhập để thực hiện thao tác này.",
          });
          return;
        }

        try {
          const response = await fetch(
            `http://localhost:3004/api/posts/${postId}/like`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username }),
              mode: "cors",
            }
          );

          if (response.ok) {
            let likeCount = parseInt(likeCountSpan.textContent);
            if (button.classList.contains("liked")) {
              likeCount--;
              button.classList.remove("liked");
            } else {
              likeCount++;
              button.classList.add("liked");
            }
            likeCountSpan.textContent = likeCount;
          } else {
            throw new Error("Network response was not ok");
          }
        } catch (error) {
          console.error("Error:", error);
          Swal.fire({
            icon: "error",
            title:
              "Đã xảy ra lỗi khi cập nhật lượt thích, vui lòng thử lại sau.",
          });
        }
      });
    });

    // Add event listeners for comment buttons
    const commentButtons = document.querySelectorAll(".comment-btn button");
    commentButtons.forEach((button) => {
      button.addEventListener("click", async function () {
        const blogShadow = button.closest(".blog.shadow");
        const commentsContainer = blogShadow.querySelector(
          ".comments-container"
        );
        const postId = blogShadow.getAttribute("data-id");

        if (commentsContainer.style.display === "none") {
          commentsContainer.style.display = "block";
          await fetchComments(
            postId,
            commentsContainer,
            blogShadow.querySelector(".comment-count")
          );
        } else {
          commentsContainer.style.display = "none";
        }
      });
    });

    // Add event listeners for submit comment buttons
    const submitCommentButtons = document.querySelectorAll(
      ".submit-comment-btn"
    );
    submitCommentButtons.forEach((button) => {
      button.addEventListener("click", async function () {
        const blogShadow = button.closest(".blog.shadow");
        const postId = blogShadow.getAttribute("data-id");
        const commentInput = blogShadow.querySelector(".blog_comment input");
        const commentContent = commentInput.value;
        const username = localStorage.getItem("username");

        if (!username) {
          Swal.fire({
            icon: "error",
            title: "Bạn cần đăng nhập để thực hiện thao tác này.",
          });
          return;
        }

        if (commentContent) {
          try {
            const response = await fetch(
              `http://localhost:3004/api/posts/${postId}/comments`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, commentContent }),
              }
            );

            if (response.ok) {
              commentInput.value = "";
              await fetchComments(
                postId,
                blogShadow.querySelector(".comments-container"),
                blogShadow.querySelector(".comment-count")
              );
            } else {
              throw new Error("Network response was not ok");
            }
          } catch (error) {
            console.error("Error:", error);
            Swal.fire({
              icon: "error",
              title: "Đã xảy ra lỗi khi đăng bình luận, vui lòng thử lại sau.",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Nội dung bình luận không thể để trống.",
          });
        }
      });
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchComments(postId, commentsContainer, commentCountSpan) {
  try {
    const response = await fetch(
      `http://localhost:3004/api/posts/${postId}/comments`
    );
    const data = await response.json();
    commentsContainer.innerHTML = "";
    commentCountSpan.textContent = data.length;

    data.forEach((comment) => {
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment");

      commentDiv.innerHTML = `
                <div class="blog shadow">
                    <div class="blog_user">
                        <div class="avata_user">
                           <img id="preview-img" src="./img/user.jpg" alt="profileImage" />
                        </div>
                        <p>${comment.username}</p>
                    </div>
                    <div class="comment_content">
                        <p>${comment.commentContent}</p>
                    </div>
                    <div class="comment_time">
                        <p>${new Date(comment.createdAt).toLocaleString()}</p>
                    </div>
                </div>    
            `;

      commentsContainer.appendChild(commentDiv);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

document.getElementById("next").addEventListener("click", async function () {
  currentPage++;
  await fetchPosts(currentPage);
});

document.getElementById("prev").addEventListener("click", async function () {
  if (currentPage > 1) {
    currentPage--;
    await fetchPosts(currentPage);
  }
});
