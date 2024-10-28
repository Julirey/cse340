const pool = require("../database/")

/* *****************************
 *   Add new review
 * *************************** */
async function addReview(review_text, inv_id, account_id){
  try {
    const sql = "INSERT INTO public.review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
    return await pool.query(sql, [review_text, inv_id, account_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Get all the details of a specific review item
 * ************************** */
async function getReviewById(review_id) {
  try {
    const data = await pool.query(
      `SELECT r.*, a.*, i.* FROM public.review AS r
      JOIN public.account AS a 
      ON r.account_id = a.account_id 
      JOIN public.inventory AS i 
      ON r.inv_id = i.inv_id 
      WHERE review_id = $1`,
      [review_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getreviewbyid error " + error)
  }
}

/* ***************************
 *  Get all review items by account_id
 * ************************** */
async function getReviewByAccountId(account_id) {
  try {
    const data = await pool.query(
      `SELECT r.*, a.*, i.* FROM public.review AS r
      JOIN public.account AS a 
      ON r.account_id = a.account_id 
      JOIN public.inventory AS i 
      ON r.inv_id = i.inv_id 
      WHERE r.account_id = $1
      ORDER BY review_date DESC`,
      [account_id]
    )
    return data.rows
  } catch (error) {
    console.error("getreviewsbyaccountid error " + error)
  }
}

/* ***************************
 *  Get all review items by inv_id
 * ************************** */
async function getReviewByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT r.*, a.*, i.* FROM public.review AS r
      JOIN public.inventory AS i 
      ON r.inv_id = i.inv_id 
      JOIN public.account AS a 
      ON r.account_id = a.account_id 
      WHERE r.inv_id = $1
      ORDER BY review_date DESC`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getreviewsbyinventoryid error " + error)
  }
}

/* ***************************
 *  Update review Data
 * ************************** */
async function updateReview(review_text, review_id) {
  try {
    const sql =
      "UPDATE public.review SET review_text = $1 WHERE review_id = $2 RETURNING *"
    const data = await pool.query(sql, [
      review_text,
      review_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("updateReview error " + error)
  }
}

/* ***************************
 *  Delete review Item
 * ************************** */
async function deleteReview(review_id) {
  try {
    const sql = 'DELETE FROM public.review WHERE review_id = $1'
    const data = await pool.query(sql, [review_id])
  return data
  } catch (error) {
    throw new Error("Delete review Error")
  }
}

module.exports = { addReview, getReviewById, getReviewByAccountId, getReviewByInventoryId, updateReview, deleteReview }