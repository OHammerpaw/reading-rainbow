// Import Dependencies
const express = require('express')
const Book = require('../models/book')


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
		.then(books => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			const userId = req.session.userId

			res.render('books/index', { books, username, loggedIn, userId })
		})
		.catch(err => res.redirect(`/error?error=${err}`))
	
		// .then((res) => res.json())
		// .then((data) => {
		// 	let output = data.items.forEach(book => {

		// 	})
  		// })
		// .polpulate()

		// .then(library => {
		// 	const books = library.data.items
		// 	const username = req.session.username
		// 	const loggedIn = req.session.loggedIn
		// 	// console.log(books)
			
		// 	// res.render('books/index', books.data)
		// 	res.render('books/index', { books, username, loggedIn })
			
		// })
		// .catch(error => {
		// 	res.redirect(`/error?error=${error}`)
		// })
})

// ROUTE TO SHOW RESULTS OF BOOK SEARCH

router.post('/?', (req, res) => {
	console.log(req.body.book)
	Book.find({title:{$eq: req.body.book}})
		.then(books => {
			console.log(books)
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			const userId = req.session.userId

			res.redirect(`/books/${books[0]._id}`)
		})
		.catch(err => res.redirect(`/error?error=${err}`))
})  

// router.get('/result', async (req, res) => {
// 	let book
// } )

// router.get('/?:title', (req, res, next) => {

// 	const filters = req.query;
// 	const filteredBooks = data.filter(title => {
// 		let isValid = true;
// 		for (key in filters) {
// 			isValid = isValid && title[key] == filters[key];
// 		}
// 		return isValid;
// 	})
		

	// let query = req.body.book

	// 	Book.find({ query })


	// 	.then((res) => res.json())
	// 	.then(books => {
	// 		createBookCards(books)
	// 		filteredBooks = books
	// 	})
	// 	.catch(error => {
	// 		res.redirect(`/error?error=${error}`)
	// 	})
// })

// const bookSearch = document.getElementById('volumeInfo').value
// let filteredBooks= []

//INDEX TO SHOW INDIVIDUAL USER'S BOOKS

router.get('/mine', (req, res) => {
    // destructure user info from req.session
	const { username, userId, loggedIn } = req.session
	Book.find({ owner: userId })
		.then(books => {
			
			res.render('books/index', { books, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// new route -> GET route that renders our page with the form

// router.get('/new', (req, res) => {
// 	const { username, userId, loggedIn } = req.session
// 	res.render('books/new', { username, loggedIn, userId })
// })

// create -> POST route that actually calls the db and makes a new document

// router.post("/", (req, res) => {
	
// 	req.body.owner = req.session.userId
// 	Book.create(req.body)
// 		.then(book => {
// 			const { username, userId, loggedIn } = req.session
// 			// console.log('this was returned from create', book)
// 			res.redirect('/books')
// 		})
// 		.catch(err => {
// 			res.redirect(`/error?error=${err}`)
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
				return book.updayeone(req.body)
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

	// .populate("review.author", "username")
	.then(book => {
		const { username, userId, loggedIn } = req.session
		res.render('books/show', { book, username, loggedIn, userId })
	})
	.catch(err => res.redirect(`/error?error=${err}`))
})

	// const bookTitle = req.params.title

	// Book.findById(bookId)
		// .then(library => {
		// 	console.log(library)
		// 	const books = library.data.items
        //     const {username, loggedIn, userId} = req.session
		// 	res.render('books/show', { book:singleBook, username, loggedIn, userId })
		// })
		// .catch((error) => {
		// 	res.redirect(`/error?error=${error}`)
		// })
		
// })

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
