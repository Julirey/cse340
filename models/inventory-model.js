const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

let thing = getClassifications;

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get all the details of a specific inventory item
 * ************************** */
async function getDetailsByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = $1`,
      [inv_id]
    )
    console.log(data.rows)
    return data.rows
  } catch (error) {
    console.error("getdetailsbyid error " + error)
  }
}

/* *****************************
 *   Add new classification
 * *************************** */
async function addClassification(classification_name){
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* *****************************
 *   Add new vehicle
 * *************************** */
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
  try {
    const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing classification
 * ********************* */
async function checkExistingClassification(type, value) {
  if (type === "name") {
    try {
      const sql = "SELECT * FROM public.classification WHERE classification_name = $1";
      const classification = await pool.query(sql, [value]);
      return classification.rowCount;
    } catch (error) {
      return error.message;
    }
  } else if (type === "id") {
    try {
      const sql = "SELECT * FROM public.classification WHERE classification_id = $1";
      const classification = await pool.query(sql, [value]);
      return classification.rowCount;
    } catch (error) {
      return error.message;
    }
  } else {
    throw new Error("Invalid type for checkExistingClassification function")
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getDetailsByInventoryId, addClassification, addInventory, checkExistingClassification}