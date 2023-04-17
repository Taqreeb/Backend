const path = require('path');
const express = require('express');
const businessController = require('../../controllers/business');
const isAuthenticatedUser= require('../../middleware/authenticate')
const isAuthorizedUser= require('../../middleware/authorize')
const router = express.Router();


router.post('/businesses',isAuthenticatedUser,isAuthorizedUser('vendor'),businessController.addBusiness)
router.get('/businesses',isAuthenticatedUser,isAuthorizedUser('vendor'),businessController.getSpecificVendorBusiness) 
router.get('/businesses/:id',isAuthenticatedUser,isAuthorizedUser('vendor','admin'),businessController.getSpecificBusiness)
router.put('/businesses/:id',isAuthenticatedUser,isAuthorizedUser('vendor','admin'),businessController.UpdateSpecificBusiness)
router.delete('/businesses/:id',isAuthenticatedUser,isAuthorizedUser('vendor','admin'),businessController.deleteSpecificBusiness)


module.exports = router;