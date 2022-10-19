////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Book = require("../models/book")

/////////////////////////////////////////
// Create Router
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// Routes
///////////////////////////////////////////


// //GET to show edit page
// router.get("/edit/:bookId/:revId", (req, res) => {
//     const revId = req.params.revId
//     const bookId = req.params.bookId

//     Book.findById(bookId)
//     . then(book => {
//         const theReview = book.reviews.id(revId)
//         res.render('reviews/edit')
//     })
// })

//UPDATE
// only the author of the comment can edit it
 router.get('/edit/:bookId/:revId', (req, res ) => { //<--
    console.log('THE GET ROUTE')
    
    const { username, userId, loggedIn } = req.session
    const bookId = req.params.bookId
    const revId = req.params.revId

    Book.findById(bookId)
    .then(book => {// bad indentation here
       // there is a subdocument method built in called .id we can use here that may help. o is a bad variable name 
        let theReview = book.reviews.find(o => o.id === revId);// o.id will likely never be === to revId because they are different types, use loose equality here ( Type id and Type string can have the same value but are not ===)
        console.log('this is the review that was found', theReview)

        if (req.session.loggedIn) { // consolidate as errors are the same using &&

            if (theReview.author == req.session.userId) {
                
                res.render('reviews/edit', { book, theReview, username, loggedIn, userId })
                
            } else {
                const err = `'you%20are%20not%20authorized%20for%20this%20action'`
                res.redirect(`/err?error=${err}`)
            }
        } else {
            const err = `'you%20are%20not%20authorized%20for%20this%20action'`
            res.redirect(`/err?error=${err}`)
        }
    }) 
    // no catch ?
 })// <--
// be mindful of your indentation - we have some sneaky spaces in here, i like to use indent rainbow plug in to make indentation easier to see with color coding ( highlights these in red )
 router.put('/:bookId/:revId', (req, res) => {// < --
    
    const bookId = req.params.bookId
    const revId = req.params.revId
    console.log("THE PUT ROUTE")
    Book.findById(bookId)
    .then(book => {
        const index = book.reviews.findIndex(object => {
            return object.id === revId;
          });// < -- also, we fortunately don't need semi colons in modern js
          book.reviews[index].review=req.body.review// <--
          book.save()// < -- 
        console.log(book.id)
        res.redirect(`/books/${book.id}`)
    })
    .catch((error) => {
        const err = `'you%20are%20not%20authorized%20for%20this%20action`
        res.redirect(`/err?error=${err}`)
    })
 })// < --


//DELETE
// only the author of the comment can delete it
router.delete(`/delete/:bookId/:revId`, (req, res) => {

    const bookId = req.params.bookId
    const revId = req.params.revId

    Book.findById(bookId)
        .then(book => {
            const theReview = book.reviews.id(revId)// good use of the id method here ( i mentioned it above !)
            console.log('this is the review that was found', theReview)

            if (req.session.loggedIn) {

                if (theReview.author == req.session.userId) { // this block returns the same error as the previous condition, consolidate to 1 if with && 

                    theReview.remove()
                    book.save()
                    res.redirect(`/books/${book.id}`)

                } else {
                    const err = `'you%20are%20not%20authorized%20for%20this%20action`
                    res.redirect(`/err?error=${err}`)
                }
            } else {
                const err = `'you%20are%20not%20authorized%20for%20this%20action`
                res.redirect(`/err?error=${err}`)
            }
        }) 
        .catch(err => res.redirect(`/error?error=${err}`))
})


//POST 
// only logged in users can post reviews
router.post('/:bookId', (req, res) => {
    const bookId = req.params.bookId

    if (req.session.loggedIn) {
        req.body.author = req.session.userId
    } else {
        res.sendStatus(401)
    }

    Book.findById(bookId)
    // don't put white space between our db calls and chained promise functions 
    .then(book => {// mind our indentation here
        book.reviews.push(req.body)

        return book.save()
    })
    .then(book => {// mind our indentation here
        res.redirect(`/books/${book.id}`)
    })
    .catch(err => res.redirect(`/error?error=${err}`))

})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router
