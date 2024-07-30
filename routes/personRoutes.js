const express = require('express');
const router = express.Router();
const Person = require ('../models/Person');
const {jwtAuthMiddleware, generateToken} = require('../jwt');


 // POST route to add a person
 router.post('/signup', async (req, res)=>{
    try{  
    const data = req.body // assuming the req body contain the person data
    
    //create a new Person document using the mongoose model
    const newPerson = new Person(data);
  
    // Save the new person to the database
     const savedPerson = await newPerson.save();
     console.log("person data saved");

     const payload = {
      id: savedPerson.id,
      username:savedPerson.username
     }

     const token = generateToken(payload);
     console.log("Token is : ", token);

     res.status(200).json({savedPerson:savedPerson, token:token})
    }catch(err){
      console.log(err);
      res.status(500).json({error:'Internal Server Error'})
    }
    })

    // Login Route
    router.post('/login', async (req, res) => {
      try {
        //extract the username and password from request body
        const {username, password} = req.body;

        //find the user by username
        const user = await Person.findOne({username:username});

        // if username doesnot exit or password invalid

        if((!user) || !(await user.comparePassword(password))){
          return res.status(401).json({error: 'Invalid username or password'});
        }

        // generate token
        const payload = {
          id: user.id,
          username: user.username
        }

        const token = generateToken(payload);

        // return token with response
        res.json({token})
      } catch (error) {
        console.log(err);
        res.status(500).json({error: 'Internal server error'})
      }
    })

    router.get('/', jwtAuthMiddleware, async (req, res)=> {
        try {
            const data = await Person.find();
            console.log("Data Fetched");
            res.status(200).json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({error:'Internal Server Error'})
            
        }
      })

      //profile route
      router.get('/profile', jwtAuthMiddleware, async (req, res)=>{
        try {
          const userData = req.user;
          console.log("user data: ", userData);

          const userId = userData.id;
          const user = await Person.findById(userId);
          res.status(200).json({user});
          
        } catch (err) {
          console.log(err);
            res.status(500).json({error:'Internal Server Error'})
        }
      } )

      router.get('/:workType', async (req, res)=> {
        try {
          const workType = req.params.workType; // extract the work type from the url
          if(workType=='chef' || workType=='waiter' || workType=='manager'){
            const response = await Person.find({work:workType});
            console.log('Response Fetch');
            res.status(200).json(response);
  
          }else{
            res.status(404).json({error: 'Invalid Work Type'});
          }
          
        } catch (error) {
          console.log(err);
          res.status(500).json({error:'Internal Server Error'})
        }
      })

      router.put('/:id', async (req, res)=>{
        try {
          const personID = req.params.id; // Extract the id from url parameter
          const updatedPersonData = req.body; //updated data for person

         const response = await Person.findByIdAndUpdate(personID, updatedPersonData, {
          new: true, //Return the updated documents
          runValidators: true, // Run mongoose validation
         })

         if(!response){
          return res.params(404).json({error: 'Person not found'});

         }
         console.log("Person data updated");
         res.status(200).json(response);
          
        } catch (err) {
          console.log(err);
          res.status(500).json({error:'Internal Server Error'})
        }
      })

      router.delete('/:id', async (req, res)=>{
        try {
          const personID = req.params.id; // extract the person id from url parameter

          // Assuming you have Person Model
          const response = await Person.findByIdAndDelete(personID);

          if(!response){
            return res.status(404).json({message: 'Person Not Found'});
          }
          
          console.log("Person data deleted");
          res.status(200).json({message: 'Person deleted successfully'});


        } catch (err) {
          console.log(err);
          res.status(500).json({error:'Internal Server Error'})
        }
      })

      module.exports=router;