import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/Users.js';
import bcrypt from 'bcrypt';
import mailer from '../helper/mailer.js';   

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        }
        catch (error) {
            done(error);
        }
    }
));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/login/google-callback"
}, async (accessToken, refreshToken, profile, done) => {
    const newUser = {
        googleId: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        password: await bcrypt.hash(Math.random().toString(36), 10),
    };
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = await User.create(newUser);
            // Invia email di benvenuto
            await mailer.sendMail({
                from: 'simone-taccarelli@hotmail.it',
                to: newUser.email,
                subject: "Welcome to Epiblog",
                text: "You have successfully registered to Epiblog",
                html: `<h1>Welcome to Epiblog ${newUser.firstName} </h1>`,
            });
        }
        return done(null, user);
        }
    catch (error) {
            done(error);
        }
    }));

export default passport;