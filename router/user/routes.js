const path = require('path');
const express = require('express');
const userController = require('../../controllers/user');
const Validation = require('../../Validation/Validation')
const isAuthenticatedUser= require('../../middleware/authenticate')
const isAuthorizedUser= require('../../middleware/authorize')
const router = express.Router();


router.get('/profile',isAuthenticatedUser,isAuthorizedUser('user'), userController.profile);
router.put('/updateEmail',Validation.emailValidation,isAuthenticatedUser, isAuthorizedUser('user'),userController.updateUserEmail);
router.put('/updatePassword',Validation.passwordValidation,isAuthenticatedUser, isAuthorizedUser('user'),userController.updateUserPassword);
router.put('/updateFirstName',isAuthenticatedUser, isAuthorizedUser('user'),userController.updateUserFirstName);
router.put('/updateLastName',isAuthenticatedUser, isAuthorizedUser('user'),userController.updateUserLastName);
router.put('/updatePhone',isAuthenticatedUser,Validation.phoneValidation, isAuthorizedUser('user'),userController.updateUserPhoneNo);
router.put('/updateProfilePicture',isAuthenticatedUser, isAuthorizedUser('user'),userController.updateUserProfilePicture);

module.exports = router;
