// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")

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
  utilities.handleErrors(
    // Temporary measure to allow testing 
   async (req, res) => {
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `You've successfully logged in. Welcome!`
    )
    res.status(200).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  })
)

module.exports = router;