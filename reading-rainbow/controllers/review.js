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

    .then(book => {
        book.reviews.push(req.body)

        return book.save()
    })
    .then(book => {
        res.redirect(`/books/${book.id}`)
    })
    .catch(err => res.redirect(`/error?error=${err}`))

})

//DELETE
// only the author of the comment can delete it
router.delete(`/delete/:bookId/:revId`, (req, res) => {

    const bookId = req.params.bookId
    const revId = req.params.revId

    Book.findById(bookId)
        .then(book => {
            const theReview = book.reviews.id(revId)
            console.log('this is the review that was found', theReview)

            if (req.session.loggedIn) {

                if (theReview.author == req.session.userId) {

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

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router

