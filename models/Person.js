const { uniq } = require('lodash');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcrypt')

// Define the Person Schema
const PersonSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: true
    },
    age: {
        type:Number
    },
    work:{
        type:String,
        enum:['chef', 'waiter', 'manager'],
        required:true
    },
    mobile:{
        type: String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String
    },
    salary:{
        type:Number,
        required:true
    },
    username: {
        required: true,
        type: String
    },
    password: {
        required:true,
        type:String
    }
})

PersonSchema.pre('save', async function(next){
    const person = this;

    // hash the password only if it is modified or is new.
    if(!person.isModified('password')) return next();

    try {
        //Hash password generation
        const salt = await bcrypt.genSalt(10);

        //Hash password generation
        const hashPassword = await bcrypt.hash(person.password, salt);

        //Override the plain password with the hash password
        person.password = hashPassword; 
    next();
    } catch (err) {
        return 
        
    }
})

PersonSchema.methods.comparePassword = async function(candidatePassword){

    try {
        // Use bcrypt to compare the provided password with the hash password.
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
        
    } catch (err) {
        throw err;
    }
    
}

 // create Person model
 const Person = mongoose.model('Person', PersonSchema);
 module.exports = Person;

