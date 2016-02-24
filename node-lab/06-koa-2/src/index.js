import koa from 'koa';
import convert from 'koa-convert';
import Router from 'koa-router';

const app = new koa();
const router = new Router({});

router.get('/', async ctx => {
  ctx.body = { status: 'hello' };
});

router.get('/users/1', async ctx => {
  const user = await Promise.resolve({ id: 1, name: 'ewnd9' });
  ctx.body = user;
});

app.use(async (ctx, next) => {
  const start = new Date();
  await next();

  const ms = new Date() - start;
  console.log(`ms: ${ms}`, ctx.method, ctx.url);
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.body = { message: err.message };
    ctx.status = err.status || 500;
  }
});

app.use(router.routes());
app.listen(3000);
