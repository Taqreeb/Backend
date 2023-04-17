const path = require('path');
const express = require('express');
const router = express.Router();
const Validation = require('../../Validation/Validation')
const vendorController = require('../../controllers/vendor');
const isAuthenticatedUser= require('../../middleware/authenticate')
const isAuthorizedUser= require('../../middleware/authorize')


router.get('/profile',isAuthenticatedUser, isAuthorizedUser('vendor'),vendorController.profile);
router.put('/updateEmail',Validation.emailValidation,isAuthenticatedUser, isAuthorizedUser('vendor'),vendorController.updateVendorEmail);
router.put('/updatePassword',Validation.passwordValidation,isAuthenticatedUser, isAuthorizedUser('vendor'),vendorController.updateVendorPassword);
router.put('/updateFirstName',isAuthenticatedUser, isAuthorizedUser('vendor'),vendorController.updateVendorFirstName);
router.put('/updateLastName',isAuthenticatedUser, isAuthorizedUser('vendor'),vendorController.updateVendorLastName);
router.put('/updatePhone',isAuthenticatedUser, isAuthorizedUser('vendor'),vendorController.updateVendorPhoneNo);
router.put('/updateProfilePicture',Validation.profilePictureValidation,isAuthenticatedUser, isAuthorizedUser('vendor'),vendorController.updateVendorProfilePicture);
module.exports = router;