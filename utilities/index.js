const invModel = require("../models/inventory-model")
const reviewModel = require("../models/review-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul class='navigation'>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid += '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
 * Build the details view HTML
 * ************************************ */
Util.buildDetails = async function(data){
  let vehicle = data[0];
  let grid
  if(data.length > 0){
    grid = '<div id="detail-container">'
    grid += '<img src="' + vehicle.inv_image 
    +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
    +' on CSE Motors">'
    grid += '<section class="info-card">'
    grid += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</h2>'
    grid += '<table class="info-table"><tbody>'
    grid += '<tr><td><span class="first-word">Price:</span> '
    grid += '<span>$' 
    + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
    grid += '</td></tr>'
    grid += '<tr><td><span class="first-word">Description:</span> ' + vehicle.inv_description + '</td></tr>'
    grid += '<tr><td><span class="first-word">Color:</span> ' + vehicle.inv_color + '</td></tr>'
    grid += '<tr><td><span class="first-word">Mileage:</span> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</td></tr>'
    grid += '</tbody></table>'
    grid += '</section>'
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
 * Constructs the HTML classification select list
 * ************************************ */
Util.getClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select id="classificationList" name="classification_id" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
 if (res.locals.loggedin) {
   next()
 } else {
   req.flash("notice", "Please log in.")
   return res.redirect("/account/login")
 }
}

Util.checkAccess = (req, res, next) => {
  const account = res.locals.accountData.account_type
  if (account === "Employee" || account === "Admin") {
    next()
  } else {
    req.flash("notice", "You do not have access permission. Please log in with an appropiate account type to access it.")
    res.redirect("/account/login")
  }
}

Util.checkReviewOwner = async (req, res, next) => {
  let review_id
  if (req.params.review_id) {
    review_id = parseInt(req.params.review_id)
  } else {
    review_id = parseInt(req.body.review_id)
  }
  const reviewData = await reviewModel.getReviewById(review_id)
  if (reviewData) {
    const account_id = res.locals.accountData.account_id
    if ( reviewData.account_id === account_id ) {
      next()
    } else {
      req.flash("notice", "You are not the owner of that review. Please log in with the respective account to access it.")
      res.redirect("/account/")
    }
  } else {
    req.flash("notice", "The requested review does not exist.")
    res.redirect("/account/")
  }
}

/* **************************************
 * Constructs the review list html
 * ************************************ */
Util.buildReviewList = async function (data) {
  let grid
  if(data.length > 0){
    grid = '<ul id="review-display">'
    data.forEach(review => { 
      grid += '<li>'
      grid += `<p><span class="first-word">${Array.from(review.account_firstname)[0]}${review.account_lastname}</span> wrote on ${new Intl.DateTimeFormat('en-US', { month: "long", day: "numeric", year: "numeric" }).format(new Date(review.review_date))}</p>
               <hr>
               <div class="review-box">
               <p>${review.review_text}</p>
               </div>`
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="warning">There are no reviews yet. You can be the first.</p>'
  }
  return grid
}

/* ****************************************
 *  Constructs the review table html
 * ************************************ */
Util.buildReviewTable = async function (data) { 
  let dataTable 
  if(data.length > 0){
    // Set up the table body 
    dataTable = '<table class="review-table"><tbody>'; 
    // Iterate over all reviews in the array and put each in a row 
    data.forEach(review => { 
      dataTable += `<tr><td>Reviewed the ${review.inv_year} ${review.inv_make} ${review.inv_model} on ${new Intl.DateTimeFormat('en-US', { month: "long", day: "numeric", year: "numeric" }).format(new Date(review.review_date))}</td>`; 
      dataTable += `<td><a href='/account/edit-review/${review.review_id}' title='Click to update'>Edit</a></td>`; 
      dataTable += `<td><a href='/account/delete-review/${review.review_id}' title='Click to delete'>Delete</a></td></tr>`; 
    }) 
    dataTable += '</tbody></table>'; 
  } else {
    dataTable = '<p class="warning">You have not written any review yet.</p>'
  }
  return dataTable; 
}

module.exports = Util