const mongoose = require('mongoose');
// columns of the schema
const  authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required : true
  }
})

module.exports = mongoose.model('Author', authorSchema); //Author is the name of the table (module)