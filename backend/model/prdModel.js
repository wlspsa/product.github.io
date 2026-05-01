const mongoose = require('mongoose') // Mongoose is the ODM (Object Data Modeling) library that lets us define schemas and interact with MongoDB using JavaScript objects

// Define the shape and rules for documents in the 'Products' collection
const ProductSchema = mongoose.Schema(
  {
    // ---- Relationship Field ----------------------------------------------
    // Every Product must belong to a user. Instead of duplicating user data,
    // we store a reference (foreign key equivalent) to the User document.
    addedBy: {
      type: mongoose.Schema.Types.ObjectId, 
      // ObjectId is MongoDB's built-in unique ID type — links this Product to a specific User document
      
      required: false,                       
      // A Product cannot exist without an owner, yes it can
      
      ref: 'User',                          
      // Tells Mongoose which model this ObjectId points to — enables .populate('user') to fetch full user data in queries
    },

    // ---- Product Content ----------------------------------------------
    product_name: {
      type: String,
      required: [true, 'Please name the product'], // Second element is a custom error message returned when validation fails
    },
    price:{
      type: Number,
      required: false,
      default: 0
    },
    cat_product:{
      type: Boolean,
      required: false,
      default: false
    },
    box_product:{
      type: Boolean,
      required: false,
      default: false
    },
    availability:{
      type: Boolean,
      required: false,
      default: false
    }
  },

  // ---- Schema Options ----------------------------------------------
  {
    timestamps: true, // Automatically adds and manages `createdAt` and `updatedAt` fields on every document
    //  — no need to set them manually
  }
)

// Compile the schema into a Model and export it.
// Mongoose will map this to a MongoDB collection named 'Products' (lowercased + pluralized automatically).
// Other files import this to query, create, update, or delete Products: e.g. await Product.create({...})
module.exports = mongoose.model('Product', ProductSchema)