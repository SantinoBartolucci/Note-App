const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	const user = await User.findById(id);
	done(null, user);
});

passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
		},
		async (email, password, done) => {
			const user = await User.findOne({ email: email });
			if (!user) {
				return done(null, false, { message: 'Not user found' });
			} else {
				const match = await user.comparePassword(password);
				if (match) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Incorrect password' });
				}
			}
		}
	)
);
