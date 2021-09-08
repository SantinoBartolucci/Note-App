const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

router.get('/users/login', (req, res) => {
	res.render('users/login');
});

router.post(
	'/users/login',
	passport.authenticate('local', {
		successRedirect: '/notes',
		failureRedirect: '/users/login',
		failureFlash: true,
	})
);

router.get('/users/signup', (req, res) => {
	res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
	const { name, email, password, confirm_password } = req.body;
	console.log(name);
	console.log(email);
	console.log(password);
	console.log(confirm_password);
	const errors = [];
	if (name.length == 0) {
		errors.push({ text: 'Must enter a name' });
	}
	if (!email) {
		errors.push({ text: 'Must enter a email' });
	}
	if (password != confirm_password) {
		errors.push({ text: "Password don't match" });
	}
	if (password < 4) {
		errors.push({ text: 'Password must be at least 4 character' });
	}
	if (errors.length > 0) {
		res.render('users/signup', { errors, name, email, password, confirm_password });
	} else {
		const emailUser = await User.findOne({ email: email });
		if (emailUser) {
			req.flash('error_msg', 'The email is alredy taken');
			res.redirect('/users/signup');
		} else {
			const newUser = new User({ name, email, password });
			newUser.password = await newUser.encryptPassword(password);
			await newUser.save();
			req.flash('success_msg', 'Registered Successfuly');
			res.redirect('/users/login');
		}
	}
});

router.get('/users/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;
