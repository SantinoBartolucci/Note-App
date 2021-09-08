const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	date: { type: Date, default: Date.now },
});

UserSchema.methods.encryptPassword = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

UserSchema.methods.comparePassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
