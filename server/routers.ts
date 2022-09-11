import Router from 'koa-router'
import fs from 'fs'
import path from 'path'

const router: Router = new Router()

router.post('/log', async (ctx, next) => {
  ctx.set('Access-Control-Max-Age', '86400')
  ctx.set('Vary', 'Accept-Encoding, Origin')

  const data = ctx.request.fields ?? JSON.parse(ctx.request.body)
  const type = data.type

  try {
    fs.appendFileSync(
      path.resolve(__dirname, 'log', type),
      `${new Date().toUTCString()}  ${data.spm}\n`
    )
  } catch (error) {
    console.error(error)
  }

  ctx.body = {
    success: true,
    message: '成功'
  }
})

export default router.routes()
