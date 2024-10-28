// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const inventoryValidate = require("../utilities/inventory-validation")
const reviewValidate = require("../utilities/review-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build car details
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryID));

// Route to build management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.checkAccess,
  utilities.handleErrors(invController.buildManagement)
);

// Route to build add classification view
router.get(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAccess,
  utilities.handleErrors(invController.buildAddClassification)
);

// Route to build add inventory view
router.get(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAccess,
  utilities.handleErrors(invController.buildAddInventory)
);

// Process the add classification data
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAccess,
  inventoryValidate.classificationRules(),
  inventoryValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Process the add inventory data
router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAccess,
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Route to build the inventory by classification table  
router.get(
  "/getInventory/:classification_id", 
  utilities.checkLogin,
  utilities.checkAccess,
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to build the edit inventory view  
router.get(
  "/edit/:inventory_id", 
  utilities.checkLogin,
  utilities.checkAccess,
  utilities.handleErrors(invController.buildEditInventory)
);

// Process the edit inventory data
router.post(
  "/update",
  utilities.checkLogin,
  utilities.checkAccess,
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Route to build the delete inventory view  
router.get(
  "/delete/:inventory_id", 
  utilities.checkLogin,
  utilities.checkAccess,
  utilities.handleErrors(invController.buildDeleteInventory)
);

// Process the delete inventory data  
router.post(
  "/delete", 
  utilities.checkLogin,
  utilities.checkAccess,
  utilities.handleErrors(invController.deleteInventory)
);

// Process the add review data
router.post(
  "/add-review/",
  utilities.checkLogin,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(invController.addReview)
);

// Route to cause error 
router.get("/error", utilities.handleErrors(invController.causeError));

module.exports = router;