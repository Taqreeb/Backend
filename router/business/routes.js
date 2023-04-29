const path = require("path");
const express = require("express");
const businessController = require("../../controllers/business");
const Validation = require('../../Validation/Validation')
const isAuthenticatedUser = require("../../middleware/authenticate");
const isAuthorizedUser = require("../../middleware/authorize");

const router = express.Router();

router.post(
  "/addbusiness",
  isAuthenticatedUser,
  isAuthorizedUser("vendor"),
  businessController.addBusiness
);
router.get(
  "/businesses",
  isAuthenticatedUser,
  isAuthorizedUser("vendor"),
  businessController.getSpecificVendorBusiness
);
router.get("/businesses/:id", businessController.getSpecificBusiness);

router.delete(
  "/specificbusiness/:id",
  isAuthenticatedUser,
  isAuthorizedUser("vendor", "admin"),
  businessController.deleteSpecificBusiness
);
router.delete(
  "/businesses",
  isAuthenticatedUser,
  isAuthorizedUser("vendor"),
  businessController.deleteVendorSpecificBusinesses
);

//update Business
router.put(
  "/businessName/:id",
  isAuthenticatedUser,
  isAuthorizedUser("vendor"),
  businessController.updateBusinessName
);
router.put(
  "/businessDescription/:id",
  isAuthenticatedUser,
  isAuthorizedUser("vendor"),
  businessController.updateBusinessDescription
);
router.put(
  "/businessEmail/:id",
  Validation.emailValidation,
  isAuthenticatedUser,
  isAuthorizedUser("vendor"),
  businessController.updateBusinessEmail
);
router.put(
  "/businessPhone/:id",
  Validation.phoneValidation,
  isAuthenticatedUser,
  isAuthorizedUser("vendor"),
  businessController.updateBusinessPhoneNo
);
router.put(
  "/businessLocation/:id",
  isAuthenticatedUser,
  isAuthorizedUser("vendor"),
  businessController.updateBusinessLocation
);
router.put(
    "/businessPrice/:id",
    isAuthenticatedUser,
    isAuthorizedUser("vendor"),
    businessController.updateBusinessPrice
  );
router.put(
  "/businessAddress/:id",
  isAuthenticatedUser,
  isAuthorizedUser("vendor"),
  businessController.updateBusinessAddress
);
router.put(
  "/businessDisplay/:id",
  isAuthenticatedUser,
  isAuthorizedUser("vendor"),
  businessController.updateBusinessDisplayPicture
);
router.put(
  "/businessBookedDates/:id",
  isAuthenticatedUser,
  isAuthorizedUser("vendor"),
  businessController.updateBookedDates
);
router.put(
  "/businessCoverageArea/:id",
  isAuthenticatedUser,
  isAuthorizedUser("vendor"),
  businessController.updateCoverageArea
);
router.put(
  "/businessCapacity/:id",
  isAuthenticatedUser,
  isAuthorizedUser("vendor"),
  businessController.updatePersonsCapacity
);
router.put(
  "/businessYoutube/:id",
  isAuthenticatedUser,
  isAuthorizedUser("vendor"),
  businessController.updateYoutubeUrl
);
router.put(
  "/businessFacebook/:id",
  isAuthenticatedUser,
  isAuthorizedUser("vendor"),
  businessController.updateFacebookUrl
);
router.put(
  "/businessInstagram/:id",
  isAuthenticatedUser,
  isAuthorizedUser("vendor"),
  businessController.updateInstagramUrl
);
router.put(
  "/businessPackages/:id",
  isAuthenticatedUser,
  isAuthorizedUser("vendor"),
  businessController.updateBusinessPackages
);
module.exports = router;
