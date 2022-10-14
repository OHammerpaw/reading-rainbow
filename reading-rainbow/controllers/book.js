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
		.populate("reviews.author", "username")
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
	const libType = req.body.libType
	const bookId = req.params.id
	const { username, userId, loggedIn } = req.session
	User.findById(req.session.userId)
	.then(user => {
		user.read.forEach( bookId =>{
			Book.findById(bookId)
			.populate("reviews.author", "username")
			.then( book => {
				books.push(book)
			})
		})
		res.render('books/index', {books, username, loggedIn, userId })
	})
	.catch(err => res.redirect(`/error?error=${err}`))
	
	// User.find({read:{req.session.userId}})

})
// router.get('/read', (req, res) => {

// 	const { username, userId, loggedIn } = req.session
// 	console.log("this is the book array", user.read)
// 	Book.find({read:req.body.libType})
// 	.populate("reviews.author", "username")
// 		.then(books => {
			
// 			res.render('books/index', { books, username, loggedIn, userId })
// 		})
// 		.catch(error => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })

// router.get('/toread', (req, res) => {
   
// 	const { username, userId, loggedIn } = req.session
// 	Book.find({ owner: userId })
// 	.populate("reviews.author", "username")
// 		.then(books => {
			
// 			res.render('books/index', { books, username, loggedIn })
// 		})
// 		.catch(error => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })


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
router.put('/:id', (req, res) => {
	const id = req.params.id
	

	Book.findByIdAndUpdate(bookId, req.body, { new: true })
		.then(book => {
			if (book.owner == req.session.userId) {
				return book.updateone(req.body)
			} else {
				res.sendStatus(401)
			}
		})
		.then(() => {
			res.redirect(`/books/${book.id}`)
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
