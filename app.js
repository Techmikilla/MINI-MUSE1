const express = require ("express");
const mongoose = require ("mongoose");
const app = express ();
const { unknownRoute, getBase, createUser, fetchUsers, deleteUser, updateUser, updateBlog, deleteBlog } = require("./controllers");
const { validateSignupdata, validateLogindata, isTokenValid, } = require("./controllers/validators/auth.validators");
const { loginUser, signupUser } = require("./controllers/auth.controllers");
const {
  createBlog,
  fetchBlogById,
  fetchAllBlog,
  fetchUserblogById,
} = require("./controllers/blog.controller.js");
const session = require("express-session");
const User = require("./model/user.model.js");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("./passport.js");
const PORT = process.env.PORT || 9898;
const dotenv = require("dotenv");
dotenv.config();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  

  
  app.get(
    "/googleSignup",
    passport.authenticate("google", {
      scope: ["email", "profile"],
    })
  );
  app.get(
    "/googleSignup-redirect",
    passport.authenticate("google", {
      access_type: "offline",
      scope: ["email", "profile"],
    }),
    async (req, res) => {
      if (!req.user) {
        res.status(400).json({ error: "Authentication failed" });
      }

      const userExists = await User.findOne({ email: req.user.emails[0].value });
      if (userExists) {
        const passwordMatch = userExists.checkPassword(
          req.user.id.concat("$Google")
        );
        if (passwordMatch) {
          let token = userExists.generateToken();
          res.status(201).json({
            message: "login successful",
            user: userExists,
            token,
          });
        } else {
          res.status(400).json({ message: "wrong credentials" });
        }
      } else {
        const googleUser = new User({
          fullname: req.user.displayName,
          email: req.user.emails[0].value,
          password: req.user.id.concat("$Google"),
          // phone: req.user.id,
        });
        const token = googleUser.generateToken();
        await googleUser.save();
        res
          .status(201)
          .json({ message: "signup successful", user: googleUser, token });
      }
    }
  );
  


app.get("/", getBase);
app.post("/user", validateSignupdata, createUser);
app.post("/blog", createBlog);
app.get("/users", fetchUsers);
app.get("/blog", fetchAllBlog);
app.get("/user/:id", fetchUserblogById);
app.get("/blog/:id", fetchBlogById);
app.delete("/userdel", deleteUser);
app.delete("/blogdel", deleteBlog);
app.put("/user/:id", updateUser);
app.put("/blog/:id", updateBlog);
app.post("/signup", validateSignupdata, signupUser);
app.post("/login", validateLogindata, loginUser);
app.post("/post", isTokenValid, (req, res) => {try {
    res.status(200).json( {message: "you are authorized to view this page"});
} catch (error) {

    return res.status(500).json( {message: "server error"});
}});

app.all("*", unknownRoute);


app.listen (PORT, async () => {
    try {
        console.log("server is running on port");
        await mongoose.connect( process.env.DB_URL );
        console.log("db connected successfully");
    } catch (error) {
         console.log("server error");
         console.log(error)
    }
    
});

// user = {
//     username: "",
//     email: "",
//     password: "",
// }