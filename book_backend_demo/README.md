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

##### 五、数据持久化（内存数组）

```js
// book_reposition.js
class BookReposition  {
  constructor(books) {
    this.books = books;
    this.bookId = books.length+1;
  }
  // findAll 读取全部
  async findAll() {
    return [...this.books];  // 返回数组副本
  }
  // findById 读取单个
  async findById(id) {
    return this.books.find(book => book.id === id)
  }
  // 新增书籍
  async create(book) {
    const newBook = {
      id: this.bookId++,
      ...book,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.books.push(newBook)
  }
  // 更新书籍
  async update(id,updateBook) {
    const index = this.book.findIndex(book => books.id === id)
    if(index === -1) {
      throw new Error('书籍没有找到')
    }
    const book = {
      ...this.books[index],
      ...updateBook
    }
    this.books[index] = book
    return book
  }
  // 删除书籍
  async delete(id) {
    const index = this.book.findIndex(book => books.id === id)
    if(index === -1) {
      throw new Error('书籍没有找到')
    }
    return this.books.splice(index,1)[0];
  }
}
module.exports = BookReposition;
```

修改`index.js`

```js
const BookReposition = require('./book_reposition')

const bookReposition = new BookReposition(books)

app.get('/books', async(req,res) => {
  const books = await bookReposition.findAll();
  ...
})
app.get('/books/:id', async(req, res, next) => {
  const book = await bookReposition.findById(parseInt(req.params.id))
  ...
})
app.post('/books',bookValidationRules,async(req,res) => {
  ...
  const book = await bookReposition.create(newBook)
  ...
})
app.put('/books/:id',bookValidationRules,async(req,res) => {
  ...
  const book = await bookResposition.update(parseInt(req.params.id),req.body)
  ...
})
app.delete('/books/:id', async(req,res) => {
  const book = await bookReposition.delete(parseInt(req.params.id))
})
```

错误处理中间件

```js
app.use((err,req,res,next) => {
  conse.error(err.stack)
  res.status(500).json({
    success: false,
    message: "服务器内部错误"
  })
})
```

```bash
npm install swagger-ui-express swagger-jsdoc
```

```js
//创建swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '图书管理系统',
      version: '1.0.0',
      description: '一个简单的图书管理接口文档'
    },
    servers: [    
      {
        url: 'http://localhost:3000/',
        description: '本地开发环境'
      }
    ]
  },
  apis: ['./index.js']
}
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

```

```js
//index.js
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```



