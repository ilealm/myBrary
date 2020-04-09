const express = require('express');
const router = express.Router();

router.get('/',(req, res) =>{
  res.render('index'); //whatever we pass here, will be render on -body
})

module.exports = router;