**基础的初始化项目**

```bash
mkdir server	#	后端目录
npm create vite@latest vite -- --template vue	#	vite脚手架创建前端项目

cd vite
npm install 
npm install element-plus axios pinia vue-router@4

cd server
npm init -y
npm install express
```

```js
// 创建server.js
import express from 'express';

const app = express()

app.get('/',(req, res) => {
  res.send('hello');
})

const port = 3000;
app.listen(post, () => {
  console.log(`服务成功运行在端口 ${port}`);
})
```

```bash
node server.js
# 这里需要先修改package.json中的"main",index.js改为server.js
# 服务成功运行在端口 3000
```

```
浏览器输入 localhost:3000
页面显示 hello
```

```bash
npm install dotenv
```

创建`.env`和`.gitignore`

```text
// .gitignore 文件中
node_modules
.env
```

```
// .env
DB_HOST=localhost
DB_PORT=5432
DB_USER=project_practice_user
DB_PASSWORD=project_practice_password
DB_NAME=project_practice

PORT=3000
```

修改一下`server.js`

```js
require('dotenv').config();
const post = process.env.PORT || 3000;
```

每次更改文件都需要断开连接再重新；实时更新

```bash
npm install nodemon
```

修改`package.json`

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon server.js",
    "dev": "nodemon server.js"
  },
```

```bash
npm run dev
```

如果不小心直接关闭再连接遇到提示：

```bash
Error: listen EADDRINUSE: address already in use :::3000
```

解决办法

```bash
# powershell
netstat -ano | findstr :3000
# 比如返回值
 TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       17212
 TCP    [::]:3000              [::]:0                 LISTENING       17212
taskkill -f -pid 17212
# 或者直接停止
stop-process -n node -force
```

