const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) => {
	res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
	const { title, description } = req.body;
	const errors = [];
	if (!title) {
		errors.push({ text: 'Please write a tittle' });
	}
	if (!description) {
		errors.push({ text: 'Please write a description' });
	}

	if (errors.length > 0) {
		res.render('notes/new-note', {
			errors,
			title,
			description,
		});
	} else {
		const newNote = new Note({ title, description });
		newNote.user = req.user.id;
		await newNote.save();
		req.flash('success_msg', 'Note Added Successfuly');
		res.redirect('/notes');
	}
});

router.get('/notes', isAuthenticated, async (req, res) => {
	const NotesInDb = await Note.find({ user: req.user.id }).sort({ date: 'desc' });
	let notes = [];

	for (note of NotesInDb) {
		notes.push({ title: note.title, description: note.description, id: note._id });
	}

	res.render('notes/all-notes', { notes });
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
	const note = await Note.findById(req.params.id);
	console.log(note);
	res.render('notes/edit-notes', { title: note.title, description: note.description, id: note._id });
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
	const { title, description } = req.body;
	await Note.findByIdAndUpdate(req.params.id, { title, description });
	req.flash('success_msg', 'Note Updated Successfuly');
	res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
	await Note.findByIdAndDelete(req.params.id);
	req.flash('success_msg', 'Note Deleted Successfuly');
	res.redirect('/notes');
});

module.exports = router;
