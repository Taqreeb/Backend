const path = require('path');
const express = require('express');
const isAuthenticatedUser= require('../../middleware/authenticate')
const Validation = require('../../Validation/Validation')
const isAuthorizedUser= require('../../middleware/authorize')
const adminController = require('../../controllers/admin');

const router = express.Router();

router.get('/businesses',isAuthenticatedUser,isAuthorizedUser('admin'), adminController.getAllBusiness)
router.put('/businesses/:id/status',isAuthenticatedUser,isAuthorizedUser('admin'), adminController.updateBusinessStatus)
router.get('/profile',isAuthenticatedUser,isAuthorizedUser('admin'), adminController.profile);
router.put('/updateEmail',Validation.emailValidation,isAuthenticatedUser, isAuthorizedUser('admin'),adminController.updateAdminEmail);
router.put('/updatePassword',Validation.passwordValidation,isAuthenticatedUser, isAuthorizedUser('admin'),adminController.updateAdminPassword);
router.put('/updateFirstName',isAuthenticatedUser, isAuthorizedUser('admin'),adminController.updateAdminFirstName);
router.put('/updateLastName',isAuthenticatedUser, isAuthorizedUser('admin'),adminController.updateAdminLastName);
router.put('/updatePhone',isAuthenticatedUser, isAuthorizedUser('admin'),adminController.updateAdminPhoneNo);
router.put('/updateProfilePicture',isAuthenticatedUser, isAuthorizedUser('admin'),adminController.updateAdminProfilePicture);




module.exports = router;
