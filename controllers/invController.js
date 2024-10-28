const invModel = require("../models/inventory-model")
const reviewModel = require("../models/review-model")
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
  let className
  if (data[0]) {
    className = data[0].classification_name
  } else {
    className = "No"
  }
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
  const reviewData = await reviewModel.getReviewByInventoryId(inventoryId)
  let reviews = await utilities.buildReviewList(reviewData)
  const carName = data[0].inv_make
  const carModel = data[0].inv_model
  const carYear = data[0].inv_year
  res.render("./inventory/details", {
    title: carName + " " + carModel,
    year: carYear,
    nav,
    details,
    reviews,
    errors: null,
    inv_id: inventoryId
  })
}

/* ***************************
 *  Deliver the management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.getClassificationList()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    errors: null,
    classificationList,
  })
}

/* ***************************
 *  Deliver the add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Deliver the add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.getClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    errors: null,
    classificationList,
  })
}

/* ****************************************
 *  Process add classification
 * *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.getClassificationList()
  const { classification_name } = req.body

  const inventoryResult = await invModel.addClassification(classification_name)

  if (inventoryResult) {
    nav = await utilities.getNav()
    classificationList = await utilities.getClassificationList()
    req.flash(
      "notice",
      `${classification_name} has been successfully added to the classifications.`
    )
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
      classificationList,
    })
  } else {
    req.flash("notice", "Sorry, the management process to add a new classification failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Management",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process add inventory
 * *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.getClassificationList()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const inventoryResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (inventoryResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} has been added successfully to the inventory.`
    )
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
      classificationList,
    })
  } else {
    req.flash("notice", "Sorry, the management process to add a new vehicle failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Management",
      nav,
      errors: null,
      classificationList,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Deliver the edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id  = parseInt(req.params.inventory_id )
  let nav = await utilities.getNav()
  let itemData  = await invModel.getDetailsByInventoryId(inv_id)
  itemData = itemData[0];
  let classificationList = await utilities.getClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    classificationList,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    inv_id: itemData.inv_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id } = req.body

  const updateResult = await invModel.updateInventory(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
  )

  if (updateResult) {
    console.log(updateResult)
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationList = await utilities.getClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    classificationList,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
    })
  }
}

/* ***************************
 *  Deliver the Delete inventory view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id  = parseInt(req.params.inventory_id )
  let nav = await utilities.getNav()
  let itemData  = await invModel.getDetailsByInventoryId(inv_id)
  itemData = itemData[0];
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    inv_id: itemData.inv_id
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    req.flash("notice", `The vehicle was deleted successfully.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).redirect(`/inv/delete/${inv_id}`);
  }
}

/* ****************************************
 *  Process add review
 * *************************************** */
invCont.addReview = async function (req, res) {
  let nav = await utilities.getNav()
  const { review_text, inv_id, account_id } = req.body
  
  const reviewResult = await reviewModel.addReview(
    review_text,
    inv_id,
    account_id
  )
  
  if (reviewResult) {
    req.flash(
      "notice",
      `The review has been added successfully.`
    )
    res.status(201).redirect(`/inv/detail/${inv_id}`)
  } else {
    const reviewData = await reviewModel.getReviewByInventoryId(inv_id)
    let reviews = await utilities.buildReviewList(reviewData)
    const data = await invModel.getDetailsByInventoryId(inventoryId)
    const details = await utilities.buildDetails(data)
    const carName = data[0].inv_make
    const carModel = data[0].inv_model
    const carYear = data[0].inv_year
    req.flash("notice", "Sorry, the process to add a review failed.")
    res.status(501).render("./inventory/details", {
      title: carName + " " + carModel,
      year: carYear,
      nav,
      details,
      reviews,
      review_text,
      inv_id,
      account_id,
    })
  }
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