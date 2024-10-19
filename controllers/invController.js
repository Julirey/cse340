const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory item details view
 * ************************** */
invCont.buildByInventoryID = async function (req, res, next) {
  const inventoryId = req.params.invId
  const data = await invModel.getDetailsByInventoryId(inventoryId)
  const details = await utilities.buildDetails(data)
  let nav = await utilities.getNav()
  const carName = data[0].inv_make
  const carModel = data[0].inv_model
  const carYear = data[0].inv_year
  res.render("./inventory/details", {
    title: carName + " " + carModel,
    year: carYear,
    nav,
    details,
  })
}

/* ***************************
 *  Purposely cause error 500
 * ************************** */
invCont.causeError = (req, res, next) => {
  const error = new Error("Oh no! There was a crash. This time a deliberate one.");
  error.status = 500;
  throw error;
};

module.exports = invCont