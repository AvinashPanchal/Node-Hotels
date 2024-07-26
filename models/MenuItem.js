const { uniq } = require("lodash")
const mongoose = require('mongoose')


// Define the Menu Schema
const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    price: {
        type:Number,
        required:true
    },
    taste: {
        type: String,
        enum: ["sweet", "spice", "sour"],
        required:true
    },
    is_drink: {
        type: Boolean,
        default:false
    },
    ingredients: {
        type: [String],
        default: [],
        required: true
    },
    num_sales: {
        type: Number,
        default: 0
    }
}) 

 // create Menu model
 const MenuItem = mongoose.model('MenuItem', menuItemSchema);
 module.exports = MenuItem;