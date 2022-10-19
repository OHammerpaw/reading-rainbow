// Import Dependencies
const express = require('express')
const Book = require('../models/book')
const User = require('../models/user')


// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

///////////////////////
/// Routes
///////////////////////



// INDEX ALL BOOKS

router.get('/', (req, res) => {
	
	Book.find({})
		.populate("reviews.author", "username") // good use of populate
		.then(books => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			const userId = req.session.userId

			res.render('books/index', { books, username, loggedIn, userId })
		})
		.catch(err => res.redirect(`/error?error=${err}`))
	
})

// ROUTE TO SHOW RESULTS OF BOOK SEARCH

router.post('/?', (req, res) => {
	
	console.log(req.body.book)
	Book.find({title:{$eq: req.body.book}})
	.populate("reviews.author", "username")
		
		.then(books => {
			console.log(books)
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			const userId = req.session.userId

			res.redirect(`/books/${books[0]._id}`)
		})
		.catch(err => res.redirect(`/error?error=${err}`))
})  



//INDEX TO SHOW INDIVIDUAL USER'S BOOKS

router.get('/read', (req, res) => {

	let books = []
	const libType = req.body.libType // unused variables
	const bookId = req.params.id
	const { username, userId, loggedIn } = req.session
	User.findById(req.session.userId)
	.then(user => {
		user.read.forEach( bookId =>{ // NICE - this logic tends to be hard to parse out : well done. I suggest trying Array.map in the future to make it just a little more dry 
			Book.findById(bookId)
			.populate("reviews.author", "username")// yay populate
			.then( book => {
				books.push(book)
			})
		})
		
		res.render('books/read', {books, username, loggedIn, userId })
	})
	.catch(err => res.redirect(`/error?error=${err}`))
})
// missing descriptive comment, also consider camel case
router.get('/toread', (req, res) => {// nice consistent styling of whitespace and good indentation throughout 

	let books = []
	const libType = req.body.libType// unused variables
	const bookId = req.params.id
	const { username, userId, loggedIn } = req.session
	User.findById(req.session.userId)
	.then(user => {
		user.toread.forEach( bookId =>{
			Book.findById(bookId)
			.populate("reviews.author", "username")
			.then( book => {
				books.push(book)
			})
		})
		res.render('books/toread', {books, username, loggedIn, userId })
	})
	.catch(err => res.redirect(`/error?error=${err}`))
})


// edit route -> GET that takes us to the edit form view

router.get('/edit/:id', (req, res) => {
	// we need to get the id
	const { username, userId, loggedIn } = req.session
	const bookId = req.params.id

	Book.findById(bookId)
		.then(book => {
			res.render('books/edit', { book, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:id', (req, res) => {// looks like we haven't implemented this route yet so i wont comment on any mistakes here yet beyond pointing out some potential things to look at to help out
	const id = req.params.id //< --a
	

	Book.findByIdAndUpdate(bookId, req.body, { new: true }) //< -- a & b
		.then(book => {
			if (book.owner == req.session.userId) {
				return book.updateone(req.body) //<-- b 
			} else {
				res.sendStatus(401)
			}
		})
		.then(() => {// <-- c
			res.redirect(`/books/${book.id}`)// <-- c
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:id', (req, res) => {
	const id = req.params.id
	
	Book.findById(id)
	.populate("reviews.author", "username")

	.then(book => {
		const { username, userId, loggedIn } = req.session
		res.render('books/show', { book, username, loggedIn, userId })
	})
	.catch(err => res.redirect(`/error?error=${err}`))
})


//get route to render "new book" form

router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session // nice use of destructuring syntax

	res.render('books/new', { username, loggedIn, userId })

})

// create route to add new books to db

router. post('/', (req, res) => {
	req.body.owner = req.session.userId

	Book.create(req.body)
		.then(book => {
			const { username, userId, loggedIn } = req.session
			res.redirect('/books/show')
		})
		.catch(err => res.redirect(`/error?error=${err}`))
		
})



// delete route
router.delete('/:id', (req, res) => {
	const bookId = req.params.id
	Book.findByIdAndRemove(bookId)
		.then(book => {
			res.redirect('/books')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
