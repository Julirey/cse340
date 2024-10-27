const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}
  
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Deliver account management view
 * *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  const accountId = parseInt(res.locals.accountData.account_id)
  let accountData =  await accountModel.getAccountById(accountId)
  accountData = accountData[0];
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_type: accountData.account_type,
  })
}

/* ****************************************
 *  Deliver account update view
 * *************************************** */
async function buildUpdate(req, res, next) {
  let nav = await utilities.getNav()
  const accountId = parseInt(res.locals.accountData.account_id)
  let accountData =  await accountModel.getAccountById(accountId)
  accountData = accountData[0];
  console.log(accountData.account_firstname)
  res.render("account/update", {
    title: "Account Information",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id,
  })
}


/* ***************************
 *  Update Account Data
 * ************************** */
async function updateAccount (req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const updateResult = await accountModel.updateAccount(
    account_firstname, 
    account_lastname, 
    account_email,
    account_id,
  )

  if (updateResult) {
    req.flash("notice", `The account information was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Account Information",
      nav,
      errors: null,
      account_firstname, 
      account_lastname, 
      account_email,
      account_id,
    })
  }
}

/* ****************************************
 *  Change Password Data
 * *************************************** */
async function changePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password, account_id } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the password change.")
    res.status(500).render("account/update", {
      title: "Account Information",
      nav,
      errors: null,
      account_firstname, 
      account_lastname, 
      account_email,
      account_id,
    })
  }
  
  const changeResult = await accountModel.changePassword(
    hashedPassword,
    account_id
  )

  if (changeResult) {
    req.flash(
      "notice",
      `Congratulations, you have successfully changed the password.`
    )
    res.redirect("/account")  
  } else {
    req.flash("notice", "Sorry, the password change failed.")
    res.status(501).render("account/update", {
      title: "Account Information",
      nav,
      errors: null,
      account_firstname, 
      account_lastname, 
      account_email,
      account_id,
    })
  }
}

/* ***********************
 * Process logout request
 *************************/
async function accountLogout(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have logged out.");
  res.redirect("/account/login");
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildUpdate, updateAccount, changePassword, accountLogout }