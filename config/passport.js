const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
module.exports=function(passport){
    passport.use(new LocalStrategy((username,password,done)=>{
        let query = {
            username:username
        }
        User.findOne(query,(err,user)=>{
            if(err)throw err;
            if(!user){
              return done(null,false,{message:"No user found"});
            }
            bcrypt.compare(password,user.password,function(err,isMatch){
                if(err)throw err;
                if(isMatch){
                return done(null,user);
                }else{
                 return done(null,false,{message:"Incorrect Password"});
                }
            })            
        })
    }))

    passport.serializeUser(function(user,done){
        done(null,user.id)
      });
      
      passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
          done(err,user);
          })
      })    
}