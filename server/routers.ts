import Router from 'koa-router'
import fs from 'fs'
import path from 'path'

const router: Router = new Router()

interface IReq {
  data: IRecord | IRecord[]
}

interface IRecord {
  type: string
  spm: string
}

function appendRecord(data: IRecord, ctx): void {
  try {
    const type = data.type
    fs.appendFileSync(
      path.resolve(__dirname, 'log', type),
      `${new Date().toUTCString()}  ${data.spm}\n`
    )
  } catch (error) {
    console.error(error)
  }
}

router.post('/log', async (ctx, next) => {
  ctx.set('Access-Control-Max-Age', '86400')
  ctx.set('Vary', 'Accept-Encoding, Origin')

  try {
    // @ts-ignore
    const req: IReq = ctx.request.fields ?? JSON.parse(ctx.request.body)

    if (req) {
      if (Array.isArray(req.data)) {
        req.data.forEach((data: IRecord): void => {
          appendRecord(data, ctx)
        })
      } else {
        appendRecord(req.data, ctx)
      }
      // 默认都能写入成功，此处不做细致的判断
      ctx.body = {
        success: true,
        message: '成功'
      }
    } else {
      ctx.body = {
        success: false,
        message: '失败'
      }
    }
  } catch (error) {
    console.error(error)
  }
})

export default router.routes()
