// 引入express模块  CommonJS 
const express = require('express');

// 引入 body validationResult 验证中间件
const { body, validationResult } = require('express-validator');

// 初始化数据，模拟 books
const books = [
  {id:1, name:'JavaScript权威指南', author:'阮一峰', price:88.8},
  {id:2, name:'Python编程从入门到实践', author:'任建军', price:99.9},
  {id:3, name:'Java从入门到精通', author:'李刚', price:129.9}
]

// 书籍验证规则
const bookValidationRules = [
  body('name').notEmpty().withMessage('书名不能为空'),
  body('author').notEmpty().withMessage('作者不能为空'),
  body('price').isFloat({min:0}).withMessage('价格必须为正数')
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
app.get('/books/:id',  (req,res) => {
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

// 路由：创建书籍
app.post('/books', bookValidationRules, (req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    })
  }
  const newBook = {
    id: books.length + 1,
    name: req.body.name,
    author: req.body.author,
    price: req.body.price
  };
  books.push(newBook);
  res.status(201).json({
    success: true,
    data: newBook
  })
})
// 路由：更新书籍
app.put('/books/:id', bookValidationRules, (req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    })
  }
  const book = books.find(book => book.id === parseInt(req.params.id));
  if(book) {
    book.name = req.body.name;
    book.author = req.body.author;
    book.price = req.body.price;
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
})
// 路由：删除书籍
app.delete('/books/:id', (req,res) => {
  const bookIndex = books.findIndex(book => book.id === parseInt(req.params.id));
  if(bookIndex !== -1) {
    books.splice(bookIndex, 1);
    res.status(200).json({
      success: true,
      message: '删除成功'
    })
  } else {
    res.status(404).json({
      success: false,
      message: '书籍不存在'
    })
  }
})

// 端口
const port = 3000;

// 启动服务
app.listen(port, () => {
  console.log(`服务已启动，端口号：${port}`);
});