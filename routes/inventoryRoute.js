// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const inventoryValidate = require("../utilities/inventory-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build car details
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryID));

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Process the add classification data
router.post(
  "/add-classification",
  inventoryValidate.classificationRules(),
  inventoryValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Process the add inventory data
router.post(
  "/add-inventory",
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Route to cause error 
router.get("/error", utilities.handleErrors(invController.causeError));

module.exports = router;