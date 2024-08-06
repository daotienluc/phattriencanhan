const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "Data.env" });

const multer = require("multer"); // Import multer

const app = express();
const port = process.env.PORT || 3004;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://bookanddocument.io.vn", // Hoặc địa chỉ của trang web của bạn
    credentials: true,
  })
);

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads")); // Define the upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Đường dẫn tuyệt đối đến thư mục public
const publicDir = path.join(__dirname, "..", "FE", "public");
// Serve static HTML files
app.use(express.static(publicDir));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

// Định tuyến cho các tệp HTML
app.get("/index.html", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/information.html", (req, res) => {
  res.sendFile(path.join(publicDir, "information.html"));
});

app.get("/register.html", (req, res) => {
  res.sendFile(path.join(publicDir, "register.html"));
});

app.get("/post.html", (req, res) => {
  res.sendFile(path.join(publicDir, "post.html"));
});

app.get("/logged.html", (req, res) => {
  res.sendFile(path.join(publicDir, "logged.html"));
});

// Register a new user
app.post("/api/register", async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
  }

  const checkUserQuery = "SELECT * FROM users WHERE username = ?";
  db.query(checkUserQuery, [username], async (err, results) => {
    if (err) {
      console.error("Error when querying database:", err);
      return res.status(500).json({ message: "Đã xảy ra lỗi khi đăng ký" });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: "Username đã tồn tại" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertUserQuery =
        "INSERT INTO users (name, username, email, password) VALUES ( ?, ?, ?, ?)";
      db.query(
        insertUserQuery,
        [name, username, email, hashedPassword],
        (err, results) => {
          if (err) {
            console.error("Error when inserting into database:", err);
            return res
              .status(500)
              .json({ message: "Đã xảy ra lỗi khi đăng ký" });
          }
          res.status(201).json({ message: "Đăng ký thành công" });
        }
      );
    } catch (error) {
      console.error("Error when hashing password:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi khi đăng ký" });
    }
  });
});

// Login a user
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Vui lòng điền đầy đủ thông tin");
  }

  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error("Error when querying database:", err);
      return res.status(500).send("Đã xảy ra lỗi khi đăng nhập");
    }
    if (results.length === 0) {
      return res.status(401).send("Tài khoản không tồn tại");
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Sai mật khẩu");
    }
    res.cookie("authToken", "exampleAuthToken", { httpOnly: true });
    res.status(200).json({
      username: user.username,
      name: user.name,
      profileImage: user.profileImage,
    });
  });
});

// Logout a user
app.post("/api/logout", (req, res) => {
  res.clearCookie("authToken");
  res.status(200).send("Logout successful");
});

// Add a new post
app.post("/api/post", (req, res) => {
  const { postTitle, postContent, username } = req.body;

  if (!postTitle || !postContent || !username) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
  }

  const insertPostQuery =
    "INSERT INTO posts (postTitle, postContent, username) VALUES (?, ?, ?)";
  db.query(
    insertPostQuery,
    [postTitle, postContent, username],
    (err, result) => {
      if (err) {
        console.error("Error adding post:", err);
        return res
          .status(500)
          .json({ message: "Đã xảy ra lỗi khi tạo bài viết" });
      }
      res.status(202).json({ message: "Đăng bài thành công" });
    }
  );
});

// Add or remove like for a post
app.post("/api/posts/:id/like", (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  if (!username) {
    return res.status(400).send("Bạn cần đăng nhập để thực hiện thao tác này");
  }

  const checkLikeQuery =
    "SELECT * FROM likes WHERE postId = ? AND username = ?";
  db.query(checkLikeQuery, [id, username], (err, results) => {
    if (err) {
      console.error("Error checking like status:", err);
      return res.status(500).send("Internal server error");
    }

    if (results.length > 0) {
      // If already liked, remove like
      const deleteLikeQuery =
        "DELETE FROM likes WHERE postId = ? AND username = ?";
      db.query(deleteLikeQuery, [id, username], (err, result) => {
        if (err) {
          console.error("Error removing like:", err);
          return res.status(500).send("Internal server error");
        }

        // Decrease like count
        const updateLikeCountQuery =
          "UPDATE posts SET likeCount = likeCount - 1 WHERE id = ?";
        db.query(updateLikeCountQuery, [id], (err, result) => {
          if (err) {
            console.error("Error updating like count:", err);
            return res.status(500).send("Internal server error");
          }
          res.status(200).send("Like removed");
        });
      });
    } else {
      // If not liked yet, add like
      const insertLikeQuery =
        "INSERT INTO likes (postId, username) VALUES (?, ?)";
      db.query(insertLikeQuery, [id, username], (err, result) => {
        if (err) {
          console.error("Error adding like:", err);
          return res.status(500).send("Internal server error");
        }

        // Increase like count
        const updateLikeCountQuery =
          "UPDATE posts SET likeCount = likeCount + 1 WHERE id = ?";
        db.query(updateLikeCountQuery, [id], (err, result) => {
          if (err) {
            console.error("Error updating like count:", err);
            return res.status(500).send("Internal server error");
          }
          res.status(200).send("Like added");
        });
      });
    }
  });
});

// Get all posts with pagination
app.get("/api/posts", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  const sql = `
        SELECT p.id, p.postTitle, p.postContent, p.username, p.likeCount , u.profileImage,
               IFNULL(c.commentCount, 0) AS commentCount
        FROM posts p
        LEFT JOIN users u ON p.username = u.username
        LEFT JOIN (
            SELECT postId, COUNT(*) AS commentCount
            FROM comments
            GROUP BY postId
        ) c ON p.id = c.postId
        ORDER BY p.timestamp DESC
        LIMIT ? OFFSET ?
    `;

  db.query(sql, [limit, offset], (err, result) => {
    if (err) {
      console.error("Error querying posts:", err);
      return res.status(500).send("Internal server error");
    }
    res.json(result);
  });
});

// Get all comments for a post
app.get("/api/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM comments WHERE postId = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error fetching comments:", err);
      return res.status(500).send("Internal server error");
    }
    res.json(result);
  });
});

// Add a new comment to a post
app.post("/api/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  const { username, commentContent } = req.body;

  if (!username) {
    return res.status(400).send("Bạn cần đăng nhập để thực hiện thao tác này");
  }

  const insertCommentQuery =
    "INSERT INTO comments (postId, username, commentContent) VALUES (?, ?, ?)";
  db.query(
    insertCommentQuery,
    [id, username, commentContent],
    (err, result) => {
      if (err) {
        console.error("Error adding comment:", err);
        return res.status(500).send("Internal server error");
      }
      res.status(202).send("Comment added");
    }
  );
});

// Check like status for a post by a specific user
app.get("/api/posts/:id/like-status", (req, res) => {
  const { id } = req.params;
  const { username } = req.query;

  if (!username) {
    return res.status(400).send("Bạn cần đăng nhập để thực hiện thao tác này");
  }

  const checkLikeQuery =
    "SELECT * FROM likes WHERE postId = ? AND username = ?";
  db.query(checkLikeQuery, [id, username], (err, results) => {
    if (err) {
      console.error("Error checking like status:", err);
      return res.status(500).send("Internal server error");
    }

    const liked = results.length > 0;
    res.json({ liked });
  });
});

// Upload profile image
app.post("/api/upload", upload.single("profileImage"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Không có tệp nào được chọn" });
  }

  const filePath = `/uploads/${path.basename(req.file.path)}`;
  const username = req.body.username; // Hoặc lấy từ cookie hoặc token nếu có

  if (!username) {
    return res.status(400).json({ message: "Không có thông tin người dùng" });
  }

  // Cập nhật đường dẫn ảnh vào bảng users
  const updateImageQuery =
    "UPDATE users SET profileImage = ? WHERE username = ?";
  db.query(updateImageQuery, [filePath, username], (err, result) => {
    if (err) {
      console.error("Error updating profile image path:", err);
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi cập nhật ảnh hồ sơ" });
    }

    res.status(200).json({ message: "Tải lên thành công", filePath });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
