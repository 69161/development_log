// 引入express模块
const express = require('express');
// dotenv模块用于读取环境变量  process.env
require('dotenv').config();

// 创建一个express实例
const app = express();
// 简单的路由测试 测试项目是否正常运行
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 设置端口号
const port = process.env.PORT || 3000;

// 监听端口
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

