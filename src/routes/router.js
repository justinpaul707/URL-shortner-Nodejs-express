var express = require("express");
var router = express.Router();
const {
    URLShortnerView,URLShortnerCreate,URLShortnerRead,URLShortnerRedirect
  } = require("../controllers/URLShortner.controller");

  
router.get('',URLShortnerView)
router.post('/urlShortner/create',URLShortnerCreate)
router.get('/urlShortner/create',URLShortnerRedirect)
router.get('/url/:uniqueId',URLShortnerRead)


module.exports = router;
