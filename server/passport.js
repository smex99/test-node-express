const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');

const User = require('./models/user');
const config = require('./config/config');

// JSON WEB TOKENS STRATEGY
passport.use(
  new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.authentication.jwtSecret
  }, async (payload, done) => {
    try {
      const user = await User.findById(payload.sub);

      if (!user) {
        return done(null, false);
      }

      done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// GOOGLE OAuth STRATEGY
passport.use('googleToken',
  new GooglePlusTokenStrategy({
    clientID: config.oauth.google.clientID,
    clientSecret: config.oauth.google.clientSecret
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser  = await User.findOne({ "google.id": profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser = new User({
        method: 'google',
        google: {
          id: profile.id,
          email: profile.emails[0].value
        }
      });

      await newUser.save();
      done(null, newUser);
    } catch (error) {
      done(error, false, error.message);
    }
  })
);

// FACEBOOK Oauth STRATEGY
passport.use('facebookToken', new FacebookTokenStrategy({
  clientID: config.oauth.facebook.clientID,
  clientSecret: config.oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  try {    
    const existingUser = await User.findOne({ "facebook.id": profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = new User({
      method: 'facebook',
      facebook: {
        id: profile.id,
        email: profile.emails[0].value
      }
    });

    await newUser.save();
    done(null, newUser);
  } catch(error) {
    done(error, false, error.message);
  }
}));

// LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email'
  }, async (email, password, done) => {
    try {
      const user = await User.findOne({ "local.email": email });
      
      if (!user) {
        return done(null, false);
      }

      const isMatch = await user.isValidPassword(password);
      
      if (!isMatch) {
        return done(null, false);
      }

      done(null, user);
    } catch (error) {
        return done(error, false);
    }
  })
);