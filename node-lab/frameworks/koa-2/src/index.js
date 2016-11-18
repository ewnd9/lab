import 'source-map-support/register';
import dotenv from 'dotenv';
dotenv.config();

import koa from 'koa';
import convert from 'koa-convert';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';

const app = new koa();

app.use(bodyParser());
app.keys = [process.env.SESSION_SECRET];
app.use(convert(session(app)));

// depends on `dotenv.config()`
const { User } = require('./db/db');
const passport = require('./helpers/passport').default;

app.use(passport.initialize());
app.use(passport.session());

const router = new Router();

router.get('/', async ctx => {
  ctx.body = {
    status: 'hello',
    user: ctx.req.user && ctx.req.user.username || 'Guest'
  };
});

router.get('/auth/vk', passport.authenticate('vkontakte', { scope: ['friends', 'offline', 'audio'] }));
router.get('/auth/vk/callback', passport.authenticate('vkontakte'), ctx => {
  ctx.redirect('/');
});

router.get('/auth/logout', async ctx => {
  ctx.session = null;
  ctx.body = {
    status: 'good-bye'
  };
});

router.get('/users/1', async ctx => {
  const user = await Promise.resolve(User.findOne());
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
    ctx.status = err.status || 500;

    ctx.body = {
      status: 'error',
      code: ctx.status,
      message: err.message
    };
  }
});

app.use(router.routes());
app.listen(3000);
