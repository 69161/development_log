// 引入express模块  CommonJS 
const express = require('express');

// 初始化数据，模拟 books
const books = [
  {id:1, name:'JavaScript权威指南', author:'阮一峰', price:88.8},
  {id:2, name:'Python编程从入门到实践', author:'任建军', price:99.9},
  {id:3, name:'Java从入门到精通', author:'李刚', price:129.9}
]

// 创建一个express app 实例
const app = express();

// json解析中间件
app.use(express.json());
// url编码中间件
app.use(express.urlencoded({extended:true}));

// 简单的路由
app.get('/', (req,res) => {
  res.send('图书管理系统')
});

// 路由：获取所有书籍
app.get('/books', (req,res) => {
  res.status(200).json({
    success: true,
    count: books.length,
    data: books
  })
});

// 路由：获取单个书籍
app.get('/books/:id', (req,res) => {
  const book = books.find(book => book.id === parseInt(req.params.id));
  if(book) {
    res.status(200).json({
      success: true,
      data: book
    })
  } else {
    res.status(404).json({
      success: false,
      message: '书籍不存在'
    })
  }
});

// 端口
const port = 3000;

// 启动服务
app.listen(port, () => {
  console.log(`服务已启动，端口号：${port}`);
});