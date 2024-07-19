const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

//users/:userId/foods
router.get('/', async(req, res) => {
  try{
    const currentUser = await User.findById(req.session.user._id)
    res.render('foods/index.ejs', {user: currentUser, pantrys: currentUser.pantrys})
  }
  catch (error){
    console.log(error)
    res.redirect('/')
  }
})

router.get('/new', async(req,res) => {
  res.render('new.ejs')
})

router.post('/', async(req, res) => {
  try{
    const currentUser = await User.findById(req.session.user._id)
    //since the form name is food 
    currentUser.pantrys.push(req.body)
    await currentUser.save()
    res.redirect(`/users/${currentUser}/foods`)
}
  catch(error){
    console.log(error)
    res.redirect('/')
  }
})

router.get('/:itemId', async (req, res) => {
  try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Find the application by the applicationId supplied from req.params
    const foodItem = currentUser.pantrys.id(req.params.itemId);
    if (!foodItem) {
      return res.redirect('/');
    }
    // Render the show view, passing the application data in the context object
    res.render('foods/show.ejs', {
      user: currentUser,
      food: foodItem
    });
  } catch (error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect('/')
  }
});

router.delete('/:itemId', async (req, res) => {
  try{
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Use the Mongoose .deleteOne() method to delete 
    // an application using the id supplied from req.params
    currentUser.pantrys.id(req.params.itemId).deleteOne();
    // Save changes to the user
    await currentUser.save();
    // Redirect back to the applications index view
    res.redirect(`/users/${currentUser._id}/foods`);
  }
  catch(error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect('/')
  }
})

router.get('/:itemId/edit', async(req,res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const pantry = currentUser.pantrys.id(req.params.itemId);
    res.render('foods/edit.ejs', {
      pantry: pantry,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
});

router.put('/:itemId', async (req, res) => {
  try {
    // Find the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Find the current application from the id supplied by req.params
    const pantry = currentUser.pantrys.id(req.params.itemId);
    // Use the Mongoose .set() method, updating the current application to reflect the new form data on `req.body`
    pantry.set(req.body);
    // Save the current user
    await currentUser.save();
    // Redirect back to the show view of the current application
    res.redirect(
      `/users/${currentUser._id}/foods/${req.params.itemId}`
    );
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
});










module.exports = router;