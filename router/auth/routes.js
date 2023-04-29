const path = require('path');
const express = require('express');
const authController = require('../../controllers/auth');
const Validation = require('../../Validation/Validation')
const router = express.Router();

router.post('/login', Validation.loginValidation, authController.login);
router.post('/signup', Validation.loginValidation, authController.signup);
module.exports = router;