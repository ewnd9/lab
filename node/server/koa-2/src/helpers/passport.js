import passport from 'koa-passport';
import VKontakteStrategy from 'passport-vkontakte';

import { User } from '../db/db';

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

const vkApp = {
  clientID: process.env.VK_APP_ID,
  clientSecret: process.env.VK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/vk/callback'
};

const vkCallback = async function(accessToken, refreshToken, profile, done) {
  try {
    const user = await User.findOne({ vkId: profile.id });

    if (!user) {
      const newUser = new User();

      newUser.username = profile.displayName;
      newUser.vkId = profile.id;
      newUser.vkAccessToken = accessToken;

      await newUser.save();
      done(null, newUser);
    } else {
      done(null, user);
    }
  } catch (err) {
    done(err);
  }
};

passport.use(new VKontakteStrategy.Strategy(vkApp, vkCallback));

export default passport;
