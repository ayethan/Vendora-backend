const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');
const dotenv = require('dotenv');
dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  try {
    user.findById(id, (err, user) => {
      done(err, user);
    });
  } catch (error) {
    console.error('Error during deserialization:', error);
    done(error, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  proxy: true
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // 1. Find user by Google ID
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
            return done(null, user);
        }

        // 2. If no user, find by email to link account
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
            // Found user by email, so link their Google ID
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
        }

        // 3. If no user by email, create a new user
        const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePic: profile.photos?.[0]?.value || '',
            isVerified: true,
            role: 'General',
        });
        await newUser.save();
        return done(null, newUser);

    } catch (err) {
        return done(err, null);
    }
}));