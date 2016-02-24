import sourceMaps from 'source-map-support/register';
import dotenv from 'dotenv';
dotenv.config();

import koa from 'koa';
import convert from 'koa-convert';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import session from 'koa-generic-session';
import passport from 'koa-passport';
import VKontakteStrategy from 'passport-vkontakte';

const app = new koa();

app.use(bodyParser());

app.keys = ['secret']
app.use(convert(session()));

app.use(passport.initialize());
app.use(passport.session());

function mockUser() {
  return { id: 1, name: 'ewnd9' };
};

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  done(null, mockUser());
});

const vkApp = {
  clientID: process.env.VK_APP_ID, // VK.com docs call it 'API ID'
  clientSecret: process.env.VK_APP_SECRET,
  callbackURL:  'http://localhost:3000/auth/vk/callback'
};

const vkCallback = function(accessToken, refreshToken, profile, done) {
  console.log(accessToken);
  return done(null, mockUser());
};

passport.use(new VKontakteStrategy.Strategy(vkApp, vkCallback));

const router = new Router();

router.get('/', async ctx => {
  ctx.body = { status: 'hello' };
});

router.get('/auth/vk', passport.authenticate('vkontakte', { scope: ['friends', 'offline', 'audio'] }));
router.get('/auth/vk/callback', passport.authenticate('vkontakte'), ctx => {
  ctx.redirect('/');
});

router.get('/users/1', async ctx => {
  const user = await Promise.resolve(mockUser());
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
