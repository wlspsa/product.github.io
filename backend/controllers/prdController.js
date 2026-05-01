 
const asyncHandler = require('express-async-handler')
 
const Product = require('../model/prdModel')
const User = require('../model/userModel') // for update and delete

// http://localhost:5555/api/Products/
const getProducts = asyncHandler(async (req, res) =>{
  
  
    const Products = await Product.find()
 
    res.status(200).json(Products)
})

// ===== CREATE A Product =====
const setProduct = asyncHandler(async(req, res) => {
    // Validate that the request body contains a 'text' field 
    //  without this check, we'd save empty/useless Products to the database
    if(!req.body.product_name){
        // Set status to 400 (Bad Request) 
        //  tells the client they sent invalid data
        res.status(400)
        // Throw an error with a helpful message 
        //  asyncHandler catches this and passes it to our errorMiddleware
        throw new  Error("Please add a 'product_name' field. ")
    }
    const updates = {product_name:req.body.product_name}
    updates.price = Number((req.body.price??0))
    updates.cat_product = req.body.cat_product??false
    updates.box_product = req.body.box_product??false
    updates.availability = req.body.availability??false
    // Insert a new Product document into MongoDB 
    //  .create() both builds and saves the document in one step
    const Product_created = await Product.create(
        {
            ...updates,
            // Set the text field to whatever the client sent in the request body
            addedBy: req.user.id // adding which user created the Product
        }
    )

    // Send back the newly created Product as JSON 
    //  the client gets confirmation of what was saved, 
    // including the auto-generated _id
    res.status(200).json(Product_created)
})

// ===== UPDATE A Product =====
const updateProduct =  asyncHandler(async(req, res) => {

    // if we need to update any Product - we need an id
    // Look up the Product by the id from the URL parameter (e.g., /api/Products/abc123) 
    //  we first check if it exists before trying to update
    const product = await Product.findById(req.params.id) // this will find our Product

    // If no Product was found with that id, send a 400 error 
    //  prevents updating a non-existent document
    if(!product){
        res.status(400)
        throw new Error("Product not found")
    }

    //-------Only authorized user can update their Product---------------
    const user = await User.findById(req.user.id)
    // we want to check if user exist or not, if yes then they can only update and delete their Products
    if(!user){
        res.status(401)
        throw new Error(' user not found')
    }

    // Only the Products that belong to the user should be modified by that user.
    // if (Product.user.toString() !== req.user.id) {
    //     res.status(401)
    //     throw new Error('User not authorized')
    //  } No because old data collision

    //--------------------------------------------

    const updates = {}
    if (req.body.product_name) {updates.product_name = req.body.product_name};
    if (req.body.price) {updates.price = Number(req.body.price)}
    if (req.body.cat_product) {updates.cat_product = req.body.cat_product}
    if (req.body.box_product) {updates.box_product = req.body.box_product}
    if (req.body.availability) {updates.availability = req.body.availability}
    if (Object.keys(updates).length === 0){
        res.status(400)
        throw new Error(' please add a valid field to update')
    }

    // now lets update the Product 
    // Find the Product by id and update its text field in one operation
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,          // which Product to update
        {...updates},  // the new data to apply
        {new: true}             // return the updated document instead of the old one 
        //  without this, Mongoose returns the document as it was BEFORE the update
    )

    // Send back the updated Product so the client can see the changes took effect
    res.status(200).json(updatedProduct)
})

// ===== DELETE A Product =====
const deleteProduct = asyncHandler(async (req, res) => {

    // Find the Product first 
    //  we need the document object to call .deleteOne() on it
    const product = await Product.findById(req.params.id) // this will find our Product

    // If the Product doesn't exist, tell the client 
    //  prevents trying to delete something that's already gone
    if(!product){
        res.status(400)
        throw new Error("Product not found")
    }


    //-------Only authorized user can update their Product ---------------
    const user = await User.findById(req.user.id)
    // we want to check if useer exist or not, if yes then they can only update and delete their Products
    if(!user){
        res.status(401)
        throw new Error(' user not found')
    }

    // check if the Product has the user field, because we are adding the user key in the database
    // if (Product.user.toString() !== req.user.id) {
    //     res.status(401)
    //     throw new Error('User not authorized')
    //  }

    //--------------------------------

    // Remove the Product from the database 
    //  .deleteOne() is called on the document instance we found above
    await product.deleteOne()

    // Send back a confirmation message with the deleted Product's id 
    //  lets the client know which Product was removed
    res.status(200).json({ message: `Delete Product ${req.params.id}` })
}
)

// Export all four functions so ProductRoutes.js can attach them to the corresponding HTTP endpoints
module.exports = {
    getProducts,
    setProduct,
    updateProduct,
    deleteProduct
}