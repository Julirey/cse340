// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")
const reviewValidate = require("../utilities/review-validation")

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Route to build account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

// Route to build account update view 
router.get("/update/", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdate));

// Process the account update
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process the password change
router.post(
  "/change-password",
  utilities.checkLogin,
  regValidate.passwordChangeRules(),
  regValidate.checkPasswordChange,
  utilities.handleErrors(accountController.changePassword)
)

// Process the logout attempt 
router.get("/logout", utilities.checkLogin, utilities.handleErrors(accountController.accountLogout))

// Route to build the edit review view  
router.get(
  "/edit-review/:review_id", 
  utilities.checkLogin,
  utilities.checkReviewOwner,
  utilities.handleErrors(accountController.buildEditReview)
);

// Process the edit review data
router.post(
  "/edit-review",
  utilities.checkLogin,
  utilities.checkReviewOwner,
  reviewValidate.reviewEditRules(),
  reviewValidate.checkReviewEditData,
  utilities.handleErrors(accountController.updateReview)
);

// Route to build the delete review view  
router.get(
  "/delete-review/:review_id", 
  utilities.checkLogin,
  utilities.checkReviewOwner,
  utilities.handleErrors(accountController.buildDeleteReview)
);

// Process the delete review data  
router.post(
  "/delete-review", 
  utilities.checkLogin,
  utilities.checkReviewOwner,
  utilities.handleErrors(accountController.deleteReview)
);

module.exports = router;