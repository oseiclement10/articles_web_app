const express = require('express');
const user_router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
user_router.get('/register',(req,res)=>{
    res.render('register');
})

user_router.get('/login',(req,res)=>{
    res.render('login');
})

user_router.post('/register',(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('password2','passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();
    if(errors){
        res.render('register',{
            errors:errors
        })
    }else{
        let newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password
        });

       bcrypt.genSalt(10,(err,salt)=>{
           bcrypt.hash(newUser.password,salt,(err,hash)=>{
               if (err){
                   console.log(err);
               }else{
                   newUser.password = hash;
                   newUser.save(err=>{
                       if(err){
                       console.log(err)
                    }else{
                        req.flash('success','You have been registerd you can now log in');
                        res.redirect('/users/login');   
                    }
                   });
               }
           })
       })
        
    }
});

user_router.post('/login',(req,res,next)=>{

    passport.authenticate('local',{
      successRedirect : '/',
      failureRedirect : "/users/login",
      failureFlash : true
  })(req,res,next);
})

user_router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','you are logged out');
    res.redirect('/users/login');
})
module.exports = user_router;