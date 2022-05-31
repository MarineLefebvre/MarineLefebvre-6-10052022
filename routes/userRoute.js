const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

//defini les url API
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
