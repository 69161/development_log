不断重复性的写

图书管理系统-后端

```bash
npm init -y
npm install express
```

创建`index.js`

```bash
npm install express-validator nodemon
```

#### express-validator

`validator`：验证；

是一个中间件库，是一个在express框架的中间件库；**验证和清理传入的请求数据**

基于验证库`validator.js`针对express进行优化集成；

- 验证数据：检查字段是否符合预期规则，如验证邮箱格式、密码强度、数字范围
- 数据清理：对输入数据规范化处理，如去空格、转换字符编码等
- 自定义验证器和错误消息
- 友好处理错误：自动收集校验失败信息

##### 常用方法

- 验证器

  `isEmail()`,`isLength()`,`isInt()`,`isEmpty()`,`matches()`等

- 清理器

  `trim()`,`escape()`,`toInt()`,`normalizeEmail()`等

- 错误处理

  `validationResult(req)`获取校验结果，`errors.array()`格式化错误信息

##### 一、初始化 模拟数据  并GET获取

```js
// index.js
// 初始化数据，模拟books,数据瞎编的
const books = [
  {id:1, name:'JavaScript权威指南', author:'阮一峰', price:88.8}
];

app.get('/books',(req,res) => {
  res.status(200).json({
    success: true,
    count: books.length,
    data: books
  })
});

app.get('/books/:id',(req,res) => {
  const book = books.find(book => book.id === parseInt(req.params.id));
  if(!book) {
    res.status(404).json({
      success: false,
      message: '书籍不存在'
    })
    res.status(200).json({
			success: true,
      data:book
    })
  }
})

```

##### 二、创建书籍

```js
app.post('/books',(req,res) => {
  const book = req.body;
  book.id = books.length + 1;
  books.push(book);
  res.status(201).json({
		success: true,
    data: book
  })
})
```

所有的请求都能提交，如何保证数据安全；

```js
const { body, validationResult} = require('express-validator')
// 验证规则
const bookValidationRules = [
  body('name').notEmpty().withMessage('书名不能为空'),
  body('author').notEmpty().withMessage('作者不能为空'),
  body('price').isFloat({min:0}).withMessage('价格必须为正数')
]
// 修改post请求
app.post('/books',bookValidationRules, (req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) { 
    return res.status(400).json({
      success: false,
      errors: errors.array()
    })
  }
  const newBook = {
    id: books.length+1,
    name:req.body.name,
    author:req.body.author,
    price:req.body.price
  };
  book.push(newBook);
  res.status(201).json({
    success: true,
    data: newBook
  })
})
```

##### 三、更新书籍

```js
app.put('/books/:id', bookValidationRules, (req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpt()) {
		return res.status(400).json({
      success: false,
      errors: errors.array()
    })
  };
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
      message:'书籍不存在'
    })
  }
})
```

##### 四、删除书籍

```js
app.delete('/books/:id',(req,res) => {
  const bookIndex = book.findIndex(book => book.id === parseInt(req.params.id));
  if(bookIndex !== -1) {
    books.splice(bookIndex,1)
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
```



