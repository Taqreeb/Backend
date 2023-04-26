const path = require('path');
const express = require('express');
const businessController = require('../../controllers/business');
const isAuthenticatedUser= require('../../middleware/authenticate')
const isAuthorizedUser= require('../../middleware/authorize')

const router = express.Router();


router.post('/addbusiness',isAuthenticatedUser,isAuthorizedUser('vendor'),businessController.addBusiness)
router.get('/businesses',isAuthenticatedUser,isAuthorizedUser('vendor'),businessController.getSpecificVendorBusiness) 
router.get('/businesses/:id',businessController.getSpecificBusiness)
router.put('/businesses/:id',isAuthenticatedUser,isAuthorizedUser('vendor'),businessController.UpdateSpecificBusiness)
router.delete('/specificbusiness/:id',isAuthenticatedUser,isAuthorizedUser('vendor','admin'),businessController.deleteSpecificBusiness)
router.delete('/businesses',isAuthenticatedUser,isAuthorizedUser('vendor'),businessController.deleteVendorSpecificBusinesses)

module.exports = router;