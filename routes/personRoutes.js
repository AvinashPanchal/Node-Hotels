const express = require('express');
const router = express.Router();
const Person = require ('../models/Person');


 // POST route to add a person
 router.post('/', async (req, res)=>{
    try{  
    const data = req.body // assuming the req body contain the person data
    
    //create a new Person document using the mongoose model
    const newPerson = new Person(data);
  
    // Save the new person to the database
     const savedPerson = await newPerson.save();
     console.log("person data saved");
     res.status(200).json(savedPerson)
    }catch(err){
      console.log(err);
      res.status(500).json({error:'Internal Server Error'})
    }
    })

    router.get('/', async (req, res)=> {
        try {
            const data = await Person.find();
            console.log("Data Fetched");
            res.status(200).json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({error:'Internal Server Error'})
            
        }
      })

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