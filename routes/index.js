const express = require('express');
const router = express.Router();

router.get('/',(req, res) =>{
  res.render('index'); //whatever we pass here, will be render on -body. we dont need to specify ext BC in view engine we said the template method, ans index from views
})

module.exports = router;