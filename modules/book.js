const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  publishDate: {
    type: Date,
    required: true
  },
  pageCount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  coverImage: {
    type: Buffer, //buffer of the data representing the whole image
    required: true
  },
  coverImageType: {
    type: String,  //2 render, we need the type ext. of the image
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author'
  }
})

bookSchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    // data obj allows to use buffer data and use it as the source of the image
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`  //this is the source of the imafe obj
  }
})

module.exports = mongoose.model('Book', bookSchema)