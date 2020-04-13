const mongoose = require('mongoose');
const Book = require('./book')

// columns of the schema
const  authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required : true
  }
})


//EVERY TIME WE HAVE RELATED DATA, we need to have tos pre conditions checks
// we dont want to delete an author who is linked to a book :.
// we use a pre method to review if we can delete the author. we need require Book model
// cant be an arrow fun BS we want to acces this
// next is a callback to indicate what to do afer this function was executed
authorSchema.pre('remove', function(next) {
  Book.find({ author: this.id }, (err, books) => {
    if (err) {
      next(err)  //this passes the error to the next function
    } else if (books.length > 0) {
      next(new Error('This author has books still')); // this prevents the author to be removed
    } else {
      next() // this means that is ok to continue and remove the author
    }
  })
})

module.exports = mongoose.model('Author', authorSchema); //Author is the name of the table (module)