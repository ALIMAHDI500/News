const router = require("express").Router();
const error = require("mongoose/lib/error");
const User = require('../models/User');
const bcrypt = require("bcrypt");
const { format } = require("morgan");

// Sign Up 
router.get('/sign-up', (req, res) => {
  res.render('user/sign-up.ejs',{error:null,formData:req.body });
});

router.post("/sign-up", async (req, res) => {
  try {
    // Check if username already exists
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.render('user/sign-up.ejs', {
      error:"Username already taken",formData:req.body }
        );
     
    }
   
    
    // Validate Input of password match
    if (req.body.password !== req.body.confirmPassword) {
      return res.render('user/sign-up.ejs', { 
        error: "Password  confirm don't match Paasword please rewrite same paasword for confirm",formData:req.body
      });
    }
    
    // Hash password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    
    // Create user
    const user = await User.create({
      username: req.body.username,
      password: hashedPassword
    });
    
    // Set session and redirect to news dashboard
    req.session.userId = user._id;
    res.redirect('/user/sign-in');
    
  } catch (error) {
    console.error("Sign-up error:", error);
    res.render('user/sign-up.ejs', { 
      error: "An error occurred during sign-up. Please try again." 
    });
  }
});

// Sign-In
router.get("/sign-in", (req, res) => {
  res.render("user/sign-in.ejs", { error: null,formData:req.body });
});

router.post('/sign-in', async (req, res) => {
  try {
    // Search for User In DB
    const userInDatabase = await User.findOne({ username: req.body.username });
    
    // Validate Find User
    if (!userInDatabase) {
      return res.render('user/sign-in.ejs', {
        error: "Invalid Input please check username or password",formData:req.body
      });
    }
    
   
    const validPassword = bcrypt.compareSync(
      req.body.password, 
      userInDatabase.password
    );
  //Validate Passowrd
    if (!validPassword) {
      return res.redirect('user/sign-in.ejs',{error:"Wrong Paasword please Enter correct password",formData:req.body}
      );
      
    }
    
    // Pass user to Dashbor view
    req.session.userId = userInDatabase._id;
    res.redirect('/news');
    
  } catch (error) {
    console.error("Sign-in error:", error);
    res.render('user/sign-in.ejs', {
      error: "An error occurred during sign-in. Please try again."
    });
  }
});

// Sing Out
router.get("/sign-out", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error("Session destroy error:", err);
    res.redirect("/");
  });
});

module.exports = router;