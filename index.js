const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database,{useNewUrlParser:true,useUnifiedTopology:true});
const db = mongoose.connection;
let Article = require('./models/articles');
db.once('open',()=>console.log('connected to mongodb'));

db.on('error',function(error){console.log(`error happened \n ${error}}`)});

app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
    secret:'keyword cat',
    resave:true,
    saveUninitialized:true
}));

app.use(require('connect-flash')());
app.use((req,res,next)=>{
    res.locals.messages = require('express-messages')(req,res);
    next();
});

app.use(expressValidator({
    errorFormatter: function(param,msg,value){
      let namespace = param.split('.')
      , root = namespace.shift()
      ,formParam = root;
    
     while(namespace.lenght){
       formParam += '[' + namespace.shift() + ']';
    }
        return {
        param: formParam,
        msg:msg,
        value:value
        };
    }
    }));



app.use(passport.initialize());
app.use(passport.session());

const user_routes = require('./routes/user-routes');
const routes = require('./routes/routes');
app.get('*',(req,res,next)=>{
    res.locals.user = req.user||null;
    console.log(res.locals.user)
    next();
})

app.use('/article',routes);
app.use('/users',user_routes);

require('./config/passport')(passport);



app.get('/',(req,res)=>{
    Article.find({},(err,articles)=>{
        if(err){
            console.log(err);
        }else{
            res.render('index',{
               title:'Articles',
               articles:articles
            })

        }
    })
});
app.get('/about',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','blog.html'));
});
app.listen(port,()=>console.log(`server started on port ${port}`));