///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require('./connection')
const Book = require('./book')


///////////////////////////////////////
// Seed Script code
///////////////////////////////////////
// first we need our connection saved to a variable for easy reference
const db = mongoose.connection

db.on('open', () => {
    // bring in the array of starter books
    const startBooks = [
        { title: "The Weight of Blood", author: "Tiffany D. Jackson", pages: "406", genre: "Fiction, Horror, Thriller, YA" , ibsn: "9780063029149" },
        { title: "On Earth We're Briefly Gorgeous", author: "Ocean Vuong", pages: "246", genre: "Fiction, Contemporary, LGBRQIA+, Literary" , ibsn: "9780525562023" },
        { title: "The One", author: "John Marrs", pages: "291", genre: "Fiction, Romance, Science Fiction, Thriller " , ibsn: "9781488084874" },
        { title: "You've Lost a Lot of Blood", author: "Eric LaRocca", pages: "209", genre: "Fiction, Horror, LGBTQIA+" , ibsn: "9781088025758" },
        { title: "Hench", author: "Natalie Zina Walschots", pages: "416", genre: "Fiction, Fantasy, Science Fiction" , ibsn: "9780062978578" },
        { title: "Out There", author: "Kate Folk", pages: "256", genre: "Fiction, Short Stories, Spculative Fiction" , ibsn: "9780593231463" },
        { title: "The Enchanted", author: "Rene Denfeld", pages: "272", genre: "Fiction, Fantasy, Magical Realism" , ibsn: "9780062285522" },
        { title: "We Ride Upon Sticks", author: "Quan Barry", pages: "384", genre: "Fiction, Magical Realism" , ibsn: "9780525565437" },
        { title: "Finlay Donovan is Killing It", author: "Elle Cosimano", pages: "406", genre: "Fiction, Mystery" , ibsn: "9781250241702" },
        { title: "Comfort Me With Apples", author: "Catherynne M. Valente", pages: "112", genre: "Fiction, Horror" , ibsn: "9781250816207" },
       
    ]

    // delete all the existing books
    Book.deleteMany({})
        .then(deletedBooks => {
            console.log('this is what .remove returns', deletedBooks)

            // create a bunch of new books from startBooks
            Book.create(startBooks)
                .then(data => {
                    console.log('here are the newly created books', data)
                    db.close()
                })
                .catch(error => {
                    console.log(error)
                    db.close()
                })
        })
        .catch(error => {
            console.log(error)
            // always close connection to the db
            db.close()
        })
})