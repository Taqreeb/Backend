const path = require('path');
const express = require('express');
const authController = require('../../controllers/auth');
const Validation = require('../../Validation/Validation')
const router = express.Router();

router.post('/login', authController.login);
router.post('/signup', Validation.loginValidation, authController.signup);
router.get("/:id/verify/:token", authController.verifyEmailToken);
router.post("/requestPasswordReset", authController.passwordRecoveryEmail);
router.post("/resetPassword", authController.resetPassword);
  
module.exports = router;