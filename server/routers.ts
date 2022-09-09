import Router from 'koa-router'

const router: Router = new Router()

router.post('/log', async (ctx, next) => {
  ctx.body = {
    success: true,
    message: '成功'
  }
})

export default router.routes()
