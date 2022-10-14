////////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////////
const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

////////////////////////////////////////////
// Create router
////////////////////////////////////////////
const router = express.Router()


// Routes

// GET to render the signup form
router.get('/signup', (req, res) => {
	res.render('auth/signup')
})

// POST to send the signup info
router.post('/signup', async (req, res) => {
	// set the password to hashed password
  req.body.password = await bcrypt.hash(
		req.body.password,
		await bcrypt.genSalt(10)
	)
	// create a new user
	User.create(req.body)
		// if created successfully redirect to login
		.then((user) => {
			res.redirect('/auth/login')
		})
		// if an error occurs, send err
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// two login routes
// get to render the login form
router.get('/login', (req, res) => {
	res.render('auth/login')
})

// post to send the login info(and create a session)
router.post('/login', async (req, res) => {
	// console.log('request object', req)
	// get the data from the request body
	console.log('req.body', req.body);
	
	const { username, password } = req.body
	// then we search for the user
	User.findOne({ username: username })
		.then(async (user) => {
			// check if the user exists
			if (user) {
				// compare the password
				// bcrypt.compare evaluates to a truthy or a falsy value
				const result = await bcrypt.compare(password, user.password)

				if (result) {
					console.log('the user', user);
					
					// store some properties in the session
					req.session.username = user.username
					req.session.loggedIn = true
					req.session.userId = user.id

          			const { username, loggedIn, userId } = req.session

					console.log('session user id', req.session.userId)
					// redirect to /books if login is successful
					res.redirect('/')
				} else {
					// send an error if the password doesnt match
					res.redirect('/error?error=username%20or%20password%20incorrect')
				}
			} else {
				// send an error if the user doesnt exist
				res.redirect('/error?error=That%20user%20does%20not%20exist')
			}
		})
		// catch any other errors that occur
		.catch((error) => {
			console.log('the error', error);
			
			res.redirect(`/error?error=${error}`)
		})
})

// logout route -> destroy the session
router.get('/logout', (req, res) => {
	req.session.destroy(() => {
		res.redirect('/')
	})
})


//INDEX TO PUSH INDIVIDUAL USER'S BOOKS

router.put('/addbook/:bookId', (req, res) => {
    // destructure user info from req.session
	const bookId = req.params.bookId
	const libType = req.body.libType
	const { username, userId, loggedIn } = req.session
	console.log("request body", req.body)

	// find user
	User.findById(userId)

		.then(user => {
			if (libType == "read") {
				user.read.push(bookId)
				return user.save()
			} else {
				user.toread.push(bookId)
				return user.save()
			}
			
		}) 
		.then(user => {
			//
			console.log("this is the user", user)
			res.redirect('/')
		})
		.catch((error) => {
			console.log('the error', error);
			
			res.redirect(`/error?error=${error}`)
		})

	//grab correct array 

	// push book into user read/toread array

	// save user

	// redirect to correct page

	// handle errors


	

})

	
	// Book.find({ owner: userId })
	// .populate("reviews.author", "username")
	// 	.then(books => {
			
	// 		res.render('books/index', { books, username, loggedIn })
	// 	})
	// 	.catch(error => {
	// 		res.redirect(`/error?error=${error}`)
	// 	})
// })

// router.get('/toread', (req, res) => {
//     // destructure user info from req.session
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



// Export the Router
module.exports = router
