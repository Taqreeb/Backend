const path = require('path');
const express = require('express');
const isAuthenticatedUser= require('../../middleware/authenticate')
const isAuthorizedUser= require('../../middleware/authorize')
const adminController = require('../../controllers/admin');

const router = express.Router();

router.get('/businesses',isAuthenticatedUser,isAuthorizedUser('admin'), adminController.getAllBusiness)
router.put('/businesses/:id/status',isAuthenticatedUser,isAuthorizedUser('admin'), adminController.updateBusinessStatus)




module.exports = router;
