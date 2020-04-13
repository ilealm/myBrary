const express = require('express');
const router = express.Router();
const Author = require('../modules/author'); //this create an instance of the author model. not addig to DB jet
const Book = require('../modules/book')

// All authors route. localhost/authors
router.get('/', async(req,res) =>{
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '')  {// we use req.query BC is a get, and the value is in the url?\
    searchOptions.name = new RegExp(req.query.name, 'i')  //i means case insensitive. will searh for words like
  }
  try{
    const authors = await Author.find(searchOptions);
    // when we render, we don put the initial / in the path
    res.render('authors/index', 
      {authors:authors,
      searchOptions:req.query
    });
  } catch{
    res.redirect('/');
  }
})

// New author route. This just display the form.
// This route SOULDS be the next route afer '/' route, BC routes like '/:id' can be confused as 
router.get('/new', (req, res) =>{
  res.render('authors/new',{author:new Author()});
})

//Create author route we use POST bc is creation
router.post('/', async (req, res) =>{
  //to ensure that we save only the name in the DB
  const author = new Author({
    name: req.body.name
  })
  try{  //await works WITH PROMESSES. and they wait to the promesse to be resolved. Only works on an async function
    const newAuthor = await author.save(); //is going to wait to save the author, and theb asign it to the variable, BC mongoos is async, and we need to wait
   res.redirect(`authors/${newAuthor.id}`);
  } catch {
      res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating new Author'
    })
  }
})

// this route needs to be defined after the new route, BS the app can think that "new" is an id
// req.params,id makes referece to /:id
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    const books = await Book.find({ author: author.id }).limit(6).exec()
    res.render('authors/show', {
      author: author,
      booksByAuthor: books
    })
  } catch(err) {
    console.log(err)
    res.redirect('/')
  }
})

// we use edit to follow REST .
router.get('/:id/edit', async (req, res) =>{
  try{
    // select all the info for the autor and render edit page.
    const author = await Author.findById(req.params.id)
    res.render('authors/edit',{author: author});

  }
  catch(err){
    console.log("Error on editing Author: ", err.message);
    res.redirect('/authors');
  }
})

// the browser can only do a get and post. For put and delete we need the libraty method-override
//method-override allows to take a post form, send to the server with an especial parameter that tells if is a put or delete, and the server will call the correct
// route bases on the specific parameter
// update route. In REST we use the word put in order to define UPDATE routes 
router.put('/:id', async (req, res) => {
  let author //we are not going to set to anything later will be settle. and is outside the try so the catch can use use it
  try {
    author = await Author.findById(req.params.id)
    author.name = req.body.name; //this are the new value
    await author.save()
    res.redirect(`/authors/${author.id}`)
  } catch(err) {
    if (author == null) {
      res.redirect('/')
    } else {
      console.log("Error on saving the edited Author: ", err.message);
      res.render('authors/edit', {
        author: author,
        errorMessage: 'Error updating Author'
      })
    }
  }
})

// we use delete to follow REST 
////we are not going to set to anything later will be settle. and is outside the try so the catch can use use it
router.delete('/:id', async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    await author.remove()
    res.redirect('/authors')
  } catch {
    if (author == null) {
      res.redirect('/')
    } else {
      res.redirect(`/authors/${author.id}`)
    }
  }
})



module.exports = router;

// const getName = () => {
//   return 'Jim';
// };

// const getLocation = () => {
//   return 'Munich';
// };

// when you have a module that exports just the one thing, 
// it’s more common to use module.exports:

// EXPORT EXAMPLE
// const dateOfBirth = '12.01.1982';

// exports.getName = getName;
// exports.getLocation = getLocation;
// exports.dob = dateOfBirth;

// And in index.js:

// const user = require('./user');
// console.log(
//   `${user.getName()} lives in ${user.getLocation()} and was born on ${user.dob}.`
// );

// Notice how the name we give the exported dateOfBirth variable can be anything we 
// fancy (dob in this case). It doesn’t have to be the same as the original variable name.

// I should also mention that it’s possible to export methods and values as you go, not 
// just at the end of the file.

// exports.getName = () => {
//   return 'Jim';
// };

// exports.getLocation = () => {
//   return 'Munich';
// };

// exports.dob = '12.01.1982';

// As module.exports and exports both point to 
// the same object, it doesn’t normally matter which you use.

// However, there is a caveat. Whatever you assign module.exports to is what’s exported from your module.

// So, take the following:

// exports.foo = 'foo';
// module.exports = () => { console.log('bar'); };
// This would only result in an anonymous function being exported. The foo variable would be ignored