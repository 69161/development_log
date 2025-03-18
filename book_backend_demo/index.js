// 引入express模块  CommonJS 
const express = require('express');

// 引入 body validationResult 验证中间件
const { body, validationResult } = require('express-validator');

// 引入 BookReposition 模块
const BookReposition = require('./book_reposition')

// 引入 swagger-ui-express 模块
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// 初始化数据，模拟 books
const books = [
  {id:1, name:'JavaScript权威指南', author:'阮一峰', price:88.8},
  {id:2, name:'Python编程从入门到实践', author:'任建军', price:99.9},
  {id:3, name:'Java从入门到精通', author:'李刚', price:129.9}
]
// 实例化 BookReposition 类
const bookReposition = new BookReposition(books);

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

// 引入swagger文档
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 简单的路由
app.get('/', (req,res) => {
  res.send('图书管理系统')
});

// components swagger
/**
 * @swagger
 * components:
 *   schemas: 
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 书籍ID
 *         name:
 *           type: string
 *           description: 书籍名称
 *         author:
 *           type: string
 *           description: 作者
 *         price:
 *           type: number
 *           description: 价格
 *   parameters:
 *     bookId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *         description: 书籍ID
 *   responses:
 *     NotFound:
 *       description: 资源不存在
 *     InternalServerError:
 *       description: 服务器内部错误
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: 获取所有书籍
 *     description: 获取所有书籍
 *     responses:
 *       200:
 *         description: 书籍列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: 请求是否成功
 *                 count:
 *                   type: integer
 *                   description: 书籍数量
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 */
// 路由：获取所有书籍
app.get('/books', async(req,res) => {
  const books = await bookReposition.findAll();
  res.status(200).json({
    success: true,
    count: books.length,
    data: books
  })
});
/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: 获取单个书籍
 *     description: 获取单个书籍
 *     parameters:
 *       - $ref: '#/components/parameters/bookId'
 *     responses:
 *       200:
 *         description: 书籍信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: 请求是否成功
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
// 路由：获取单个书籍
app.get('/books/:id',  async(req,res,next) => {
  const book = await bookReposition.findById(parseInt(req.params.id));
  if(book) {
    res.status(200).json({
      success: true,
      data: book
    })
  } else {
    return next(new Error('书籍不存在'))
  }
});
/**
 * @swagger
 * /books:
 *   post:
 *     summary: 创建书籍
 *     description: 创建书籍
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: 书籍信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
// 路由：创建书籍
app.post('/books', bookValidationRules, async(req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    })
  }
  const newBook = {
    name: req.body.name,
    author: req.body.author,
    price: req.body.price
  };
  const book = await bookReposition.create(newBook);
  res.status(201).json(book)
})
/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: 更新书籍
 *     description: 更新书籍
 *     parameters:
 *       - $ref: '#/components/parameters/bookId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: 书籍信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
// 路由：更新书籍
app.put('/books/:id', bookValidationRules,async(req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    })
  }
  const book = await bookReposition.update(parseInt(req.params.id), req.body);
  if(book) {
    res.status(200).json(book)
  } else {
    res.status(404).json({
      success: false,
      message: '书籍不存在'
    })
  }
})
/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: 删除书籍
 *     description: 删除书籍
 *     parameters:
 *       - $ref: '#/components/parameters/bookId'
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: 请求是否成功
 *                 message:
 *                   type: string
 *                   description: 删除成功提示信息
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
// 路由：删除书籍
app.delete('/books/:id', async(req,res) => {
  const book = await bookReposition.delete(parseInt(req.params.id));
  if(!book) {
    res.status(404).json({
      success: false,
      message: '书籍不存在'
    })
  } 
  res.status(200).json({
    success: true,
    message: '删除成功'
  })
})




app.use((req,res,next) => {
  res.status(404).json({
    success: false,
    message: '资源不存在'
  })
})
// 错误处理中间件
app.use((err,req,res,next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  })
})



// 端口
const port = 3000;

// 启动服务
app.listen(port, () => {
  console.log(`服务已启动，端口号：${port}`);
});