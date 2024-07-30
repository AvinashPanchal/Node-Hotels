const express = require('express');
const router = express.Router();
const MenuItem = require ('../models/MenuItem');

router.post('/', async (req, res)=>{
    try{  
    const data = req.body // assuming the req body contain the person data
    
    //create a new Menu Item document using the mongoose model
    const newMenuItem = new MenuItem(data);
  
     const savedMenuItem = await newMenuItem.save();
     console.log("Menu Item data saved");
     res.status(200).json(savedMenuItem)
  
    }catch(err){
      console.log(err);
      res.status(500).json({error:'Internal Server Error'})
    }
    })

    router.get('/', async (req, res)=>{
      try {
        const data = await MenuItem.find();
        console.log("Menu Item Data Fetched");
        res.status(200).json(data);
        
      } catch (err) {
        console.log(err);
        res.status(500).json({error:'Internal Server Error'})
        
      }
    })

    router.get('/:tasteType', async (req, res)=> {
      try {
        const tasteType = req.params.tasteType; // extract the work type from the url
        if(tasteType=='spice' || tasteType=='sour' || tasteType=='sweet'){
          const response = await MenuItem.find({taste:tasteType});
          console.log('Response Fetch');
          res.status(200).json(response);

        }else{
          res.status(404).json({error:'Invalid taste Type'});
        }
        
      } catch (error) {
        console.log(err);
        res.status(500).json({error:'Internal Server Error'})
      }
    })

    router.put('/:id', async (req, res)=>{
    try {
      const menuItemId = req.params.id; // extract the menu item id from url parameter

      //updated data for Menu Item
      const updatedMenuItem = req.body;

      const response = await MenuItem.findByIdAndUpdate(menuItemId, updatedMenuItem, {
          new: true, //Return the updated documents
          runValidators: true, // Run mongoose validation
    });

      if(!response){
      return res.status(404).json({message: "Menu Item Not Found"})
      }

      console.log("Menu Item Updated");
      res.status(200).json(response);

    } catch (err) {
      console.log(err);
      res.status(500).json({error:'Internal Server Error'});
    }
    })

    router.delete('/:id', async (req, res)=>{
      try {
        const menuItemId = req.params.id; // extract the Menu Item id from url parameter

        // Assuming you have Person Model
        const response = await MenuItem.findByIdAndDelete(menuItemId);

        if(!response){
          return res.status(404).json({message: 'Menu Item Not Found'});
        }
        
        console.log("Menu Item data deleted");
        res.status(200).json({message: 'Menu Item deleted successfully'});


      } catch (err) {
        console.log(err);
        res.status(500).json({error:'Internal Server Error'})
      }
    })

    module.exports = router;