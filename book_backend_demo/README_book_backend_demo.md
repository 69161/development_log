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