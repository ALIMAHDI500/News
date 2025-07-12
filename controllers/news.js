const express = require('express');
const User = require('../models/User');
const router = express.Router();



//GET Pass User to view
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    
    if (!user) {
      return res.redirect('/user/sign-in');
    }
    
    res.render('news/index', { 
      user:user,
      news: user.pantry 
     
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});



// // GET /users/:userId/news/new - Show form to add news
router.get('/new', async (req, res) => {
  try {
    const user = await User.findById(req.session.userId); 
    
    if (!user) {
      return res.redirect('/user/sign-in');
    }
    
    res.render('news/new', { user:user });
  } catch (err) {
    console.error(err);
    res.redirect(`/users/${req.session.userId}/news`);
  }
});

// // POST /users/:userId/news - Add news to pantry
router.post('/', async (req, res) => {
  try {
  const user = await User.findById(req.session.userId);

    user.pantry.push({ title: req.body.title ,text:req.body.text, category:req.body.category,
      imageLink:req.body.imageLink,Date:req.body.Date

    })
   
    await user.save();

    res.redirect(`/news`);
  } catch (err) {
    console.error(err);
    res.redirect(`/news/new`);
  }
});




//Get - Read one show
router.get("/:postId",async(req,res)=>{
    

     const currentUser = await User.findById(req.session.userId);
    const post=currentUser.pantry.id(req.params.postId)

    res.render("news/show.ejs",{user:currentUser,post:post})
})





//EDIT -GET  
router.get('/:postId/edit',async(req,res)=>{

  try{
    const user=await User.findById(req.session.userId)
      if (!user) {
      return res.redirect('/user/sign-in');
    }

    const post=user.pantry.id(req.params.postId)
    if(!post){
      res.redirect("/news")
    }

    
    res.render("news/edit",{user:user,post:post})
  }catch(err){

    res.redirect('/news')
  }
})


///PUT
router.put("/:postId",async(req,res)=>{
  
    const currentUser = await User.findById(req.session.userId);
    
    const post=currentUser.pantry.id(req.params.postId)

    post.set(req.body);

    await currentUser.save();


    res.redirect("/news")
})



//DELETE 
router.delete("/:postId",async(req,res)=>{

  const currentUser = await User.findById(req.session.userId);
    const post=currentUser.pantry.id(req.params.postId)
      post.deleteOne()

      await currentUser.save()

    res.redirect(`/news`);
})






module.exports = router;