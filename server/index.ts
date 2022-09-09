import Koa from 'koa'
import body from 'koa-better-body'
import routers from './routers'

const app = new Koa()

// 处理body数据
app.use(body())

// 使用路由中间件
app.use(routers)

app.listen(9000)
