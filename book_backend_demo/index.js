// 引入express模块  CommonJS 
const express = require('express');

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

// 端口
const port = 3000;

// 启动服务
app.listen(port, () => {
  console.log(`服务已启动，端口号：${port}`);
});