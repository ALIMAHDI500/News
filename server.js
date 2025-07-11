const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const path = require("path");

// Middleware 
const passUserToView = require('./middleware/pass-user-to-view');
const isSignedIn = require('./middleware/is-signed-in'); 

// Controller 
const userController = require('./controllers/user.js'); 
const newsController = require('./controllers/news.js');

//Models
const User = require('./models/User'); 


const port = process.env.PORT || 3000;

// 
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
mongoose.connection.on("error", (err) => {
  console.error('MongoDB connection error:', err);
});

// 
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
   
  })
);

// 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Pass user to views
app.use(passUserToView);



app.use("/user", userController);
app.use("/news", isSignedIn, newsController);




// Home route
app.get("/", (req, res) => {
  res.render('index', { user: res.locals.user });
});



//router for gust and show one Post and can Edit or Delete
app.get("/show",async(req,res)=>{
   
 const users = await User.find({}, 'username pantry');
    
    const allNews = [];
    users.forEach(user => {
      if (user.pantry && Array.isArray(user.pantry)) {
        user.pantry.forEach(post => {
          allNews.push({
            ...post.toObject(),
            author: user.username,
            _id: post._id
          });
        });
      }
    });
res.render("news/show.ejs",{news:allNews});

})


//Run Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

