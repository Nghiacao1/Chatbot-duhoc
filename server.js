const express = require('express');
const app = express();
const path = require('path');

// Cấu hình EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Public folder cho CSS, JS, images...
app.use(express.static('public'));

// Route trang chủ
app.get('/', (req, res) => {
  res.render('index');
});

// Route trang bài viết
app.get('/blog', (req, res) => {
  res.render('blog'); // 👈 Quan trọng
});
// Route trang giới thiệu
app.get('/gioithieu', (req, res) => {
    res.render('gioithieu'); // 👈 Quan trọng
  });

// Route trang giới thiệu
app.get('/blog1', (req, res) => {
  res.render('blogs/blog1'); // không cần ghi đuôi .ejs
});
// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
