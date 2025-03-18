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