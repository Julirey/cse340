const invModel = require("../models/inventory-model")
const reviewModel = require("../models/review-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Review Data Validation Rules
 * ********************************* */
validate.reviewRules = () => {
  return [
    // review text is required and must be string
    body("review_text")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a review."),
  ]
}

/* ******************************
 * Check data and return errors or continue to add a review
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { review_text, inv_id, account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const reviewData = await reviewModel.getReviewByInventoryId(inv_id)
    let reviews = await utilities.buildReviewList(reviewData)
    const data = await invModel.getDetailsByInventoryId(inv_id)
    const details = await utilities.buildDetails(data)
    const carName = data[0].inv_make
    const carModel = data[0].inv_model
    const carYear = data[0].inv_year
    res.render("./inventory/details", {
      title: carName + " " + carModel,
      year: carYear,
      nav,
      details,
      reviews,
      review_text,
      inv_id,
      account_id,
      errors,
    })
    return
  }
  next()
}

/*  **********************************
  *  Account Update Data Validation Rules
  * ********************************* */
validate.reviewEditRules = () => {
  return [
    // review_text is required and must be string
    body("review_text")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a review"), // on error this message is sent.
  ]
}

/* ******************************
 * Check data and return errors or continue to edit 
 * ***************************** */
validate.checkReviewEditData = async (req, res, next) => {
  const { review_date, review_text, review_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const reviewData =  await reviewModel.getReviewById(review_id)
    let reviewName = `${reviewData.inv_year} ${reviewData.inv_make} ${reviewData.inv_model}`
    res.render("account/edit-review", {
      title: `Edit ${reviewName} Review`,
      nav,
      errors,
      review_date,
      review_text,
      review_id,
    })
    return
  }
  next()
}

module.exports = validate