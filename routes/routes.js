const express= require('express');
const Article = require('../models/articles');
const router = express.Router();
const User = require('../models/user');

router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('addarticle',{
     title:'Add article'    
    });
});


router.get('/:id',(req,res)=>{
    Article.findById(req.params.id,(errr,found)=>{
     if(errr){
         console.log(errr);
     }else{
         User.findById(found.author,(err,user)=>{
             if (err)console.log(err);
             else{          
            res.render('content',{
            article:found,
            author:user.name
             });
         }
        });   
         
    }
     })
});


router.post('/add',(req,res)=>{
    req.checkBody('title','Title Required').notEmpty();
    req.checkBody('body','Body Required').notEmpty();
    let errors = req.validationErrors();
    if(errors){
    res.render('addarticle',{
    title:'Add Article',
    errors:errors       
        })
    }else{
      User.findById(req.user._id,(err,user)=>{
            if(err)console.log(err);        
            let article = new Article();
            article.title=req.body.title;
            article.body=req.body.body;
            article.author = user.id;
            article.save(function(err){
            if(err){
                console.log(err);
            }else{
                req.flash("success","Article Added");
                res.redirect('/');
            }
        });

        });
        
    }
})
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    Article.findById(req.params.id,(err,article)=>{
            if(article.author!= req.user._id){
                req.flash('danger','not authorized');
                res.redirect('/');
            }else{
                res.render('edit-article',{
                    title:'Edit Article',
                    article:article
                })
            }
            
        }
    )
})

router.post('/edit/:id',(req,res)=>{
    let article = {};
    article.title = req.body.title;
    article.body = req.body.body;
    article.author = req.user.id;
    let query = {_id:req.params.id};

    Article.updateOne(query,article,(err)=>{
       if(err){
           console.log(err);
           req.flash("danger","could not update article try again later");
       }else{
        req.flash("success","Article edited");
           res.redirect('/');
       }
    })
     
})

router.delete('/delete/:id',(req,res)=>{
    if(!req.user.id){
        res.status(500).send();
    }

    let query = {
        _id:req.params.id
    };
    Article.findById(req.params.id,function(err,art){
        if (art.author != req.user.id){
            res.status(500).send({msg:"invalid request"});
        }else{
            Article.deleteOne(query,(err)=>{
                if(err){
                    console.log(err);;
                }else{
                    req.flash('success','article deleted')
                    res.send('sucess');
                }
            })
        }
    })
    
})
function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash('danger','you have to login first');
        res.redirect('/users/login');
    }
}

module.exports = router;