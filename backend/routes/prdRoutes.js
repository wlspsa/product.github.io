// Import Express — needed to access the Router factory function
const express = require('express')

// Create a Router instance
// keeping route definitions modular and out of the main server.js file
const router = express.Router()

// Import CRUD controller functions from ProductController.js
// Each function handles exactly one operation and is mapped to a route + HTTP method below

const {
    getProducts,    // GET    — fetch all Products belonging to the authenticated user
    setProduct,     // POST   — create a new Product
    updateProduct,  // PUT    — overwrite an existing Product by ID
    deleteProduct   // DELETE — remove a Product by ID
} = require('../controllers/prdController')

// Import the `protect` middleware from authMiddleware.js
// `protect` runs BEFORE the controller on any route it's applied to.
// It validates the incoming JWT from the Authorization header, decodes the user ID,
// fetches that user from the DB, and attaches them to req.user.
// If the token is missing, expired, or invalid — it rejects the request with a 401
// and the controller function never runs.
// Please look into this code (../middleware/authMiddleware)

const { protect } = require('../middleware/authMiddleware')

// ---- Routes for /api/Products/ --------------------------
// GET  /api/Products/  → protect runs first, then getProducts (returns all Products for req.user)
// ## I Do not want to protect product gets as I want these available. In production I would need to make a limited access function in protect
// POST /api/Products/  → protect runs first, then setProduct  (creates a Product owned by req.user)

router.route('/').get(getProducts).post(protect, setProduct)

// ---- Routes for /api/Products/:id--------------------------
// PUT    /api/Products/:id → protect runs first, then updateProduct (edits Product with matching :id)
// DELETE /api/Products/:id → protect runs first, then deleteProduct (removes Product with matching :id)
// :id is a URL parameter accessible in the controller via req.params.id

router.route('/:id').put(protect, updateProduct).delete(protect, deleteProduct)

// Export this router so server.js can mount it:
// app.use('/api/Products', require('./routes/ProductRoutes'))
// All routes defined above are relative to that /api/Products base path
module.exports = router