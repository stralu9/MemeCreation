'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const {check, validationResult} = require('express-validator'); // validation middleware
const dao = require('./dao'); // module for accessing the DB
const userdao=require('./user_dao');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy; // username+psw

/*** Set up Passport ***/
passport.use(new LocalStrategy(
    function(username,password,done){
        
      userdao.getUser(username,password).then((user)=>{
        if(!user)
          return done(null,false,{message:'Email e/o password errati. Riprovare.'});
        return done(null,user);
      });
    }
  ));
  
  passport.serializeUser((user,done)=>{
    done(null,user.id);
  });
  
  passport.deserializeUser((id,done)=>{
    userdao.getUserById(id).then((user)=>{
      done(null,user);
    })
    .catch((err)=>{
      done(err,null);
    });
  });

//init express
const PORT = 3001;
const app = new express();

//setup middlewares
app.use(morgan('dev'));
app.use(express.json());

const isLoggedIn=(req,res,next)=>{
    if(req.isAuthenticated())
      return next();
    return res.status(400).json({error:'Not authorized'});
  };
  
//enalbe sessions in express
app.use(session({
    secret: 'top secret - non condividere questa frase',
    resave: false,
    saveUninitialized: false,
}));

//init Passport to use sessions
app.use(passport.initialize());
app.use(passport.session());
  
app.post('/api/sessions', [check('username').isEmail()], function(req, res, next) {
  
    const errors = validationResult(req);    
    if ( !errors.isEmpty() || req.body.password.length <= 6) {
      return res.status(401).json({message: "Email e/o password errati. Riprovare."});
    }
    
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
        
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
      
      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
  
      });
    })(req, res, next);
});
  
  //LOGOUT
app.delete('/api/sessions/current', (req, res) => {
    req.logout();
    res.end();
});
  
//Get current session to check if user logged out
app.get('/api/sessions/current',(req,res)=>{
    if(req.isAuthenticated())
      res.json(req.user);
    else
      res.status(401).json({error:'Not authenticated'});
})

// GET /api/memes
app.get('/api/memes', (req, res) => {
  if(!req.query.protected)  
    dao.listMemes()
      .then(images => res.json(images))
      .catch(()=> res.status(500).end());
  else if(!req.isAuthenticated()){
    res.status(401).end();
  }
  else{
    dao.listProtectedMemes()
    .then(images => res.json(images))
    .catch(()=> res.status(500).end());
  }
    
});

// GET /api/memes/:id
app.get('/api/memes/:id/sentences', (req, res) => {
  dao.listSentencesForMeme(req.params.id).then(sentence => res.json(sentence)).catch(() => res.status(500).end());
});

// GET /api/images
app.get('/api/images', (req, res) => {
  dao.listImages().then(images => res.json(images)).catch(() => res.status(500).end());
});

// DELETE /api/memes/:id
app.delete('/api/memes/:id', isLoggedIn, async (req, res) => {  
  try {
    await dao.deleteMeme(req.params.id, req.user.id);
  } catch(err) {
    res.status(503).json({ error: `Database error during the deletion of meme ${req.params.id}.`});
  }
  try {
    await dao.deleteSentencesForMeme(req.params.id);
  } catch(err) {
    res.status(503).json({ error: `Database error during the deletion of meme ${req.params.id}.`});
  }
  res.status(204).end();
});

// POST /api/sentences
app.post('/api/sentences', isLoggedIn, async (req, res) => {
  const f = async () => {
    const sentences = req.body;
    if(sentences.filter((s) => s.sentence !== undefined && s.sentence !== '') === undefined || sentences.filter((s) => s.sentence !== undefined && s.sentence !== '').length === 0)
        return res.status(422).json({errors: "Errore nell'inserimento del testo"});

    for(let id in sentences){
      if(sentences[id].sentence !== undefined && sentences[id].sentence !== '')
        await dao.insertSentence(sentences[id], id);
    }
  }
  f().then(() => res.status(201).end()).catch((err)=> {res.status(503).json({error:err})});
});  

// POST /api/memes
app.post('/api/memes', isLoggedIn, [
  check('title').notEmpty(),
  check('iid').isNumeric(),
  check('visibility').notEmpty(),
  check('admin').isNumeric(),
  check('font').notEmpty(),
  check('color').notEmpty()
],  async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  let meme = req.body;
  if(!(meme.visibility === "protected" || meme.visibility === "public") || meme.admin !== req.user.id || meme.color === '' || meme.font === '' || meme.title === '')
    return res.status(422).json({errors: errors.array()});

  dao.insertMeme(meme).then((a) => res.json(a))
  .catch((err)=> res.status(503).json({error:err}));    
});
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));