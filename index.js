import connectToDatabase from './models/onOffBoolean.js';
import Recipe from './models/RecipeM.js';
import Storie from './models/StorieM.js';
import isLoggedIn from './middlewares/isLoggedIn.js';
import isAdmin from './middlewares/isAdmin.js';
import usersRoutes from './routes/usersR.js';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
/////////////////////////////////
import AWS from 'aws-sdk'
import multer from 'multer';
import mongoose from "mongoose"
import {uploadUserImg} from "./uploads/uploadUserImg.js"
import {uploadStorieImg} from "./uploads/uploadStorieImg.js"
import {recipecreation} from "./uploads/recipecreation.js"
/////////////////////////////////
dotenv.config();
const PORT = process.env.PORT || 6868;
/////////////////////////////////
const app = express();
app.set('view engine', 'ejs');

/////////////////////////////////
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI})
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    //console.log(req.sessionID, req.session, req.body);
    next();
})
/////////////////////////////////
//app.use
const accessLogStream = fs.createWriteStream(path.join(process.cwd(), 'access.log'), { flags: 'a' });
app.use(morgan('combined'));
app.use(morgan('combined', { stream: accessLogStream }));
//app.use
app.use(cors());
//app.use
app.use(express.static("css"));
//app.use
app.use(express.static('public'))
//app.use


app.post('/recipecreation', recipecreation.single('image'), async (req, res) => {
  res.send("recipe img uploaded")
})
app.post('/uploadStorieImg', uploadStorieImg.single('image'), async (req, res) => {
    res.send("Storie img uploaded")
  })
  app.post('/uploadUserImg', uploadUserImg.single('image'), async (req, res) => {
    res.send("User img uploaded")
  })


//app.use
app.use((err, req, res, next) => {
    accessLogStream.write(` ${req.method} ${req.path} ${err.message} \n`)
    res.status(500).render('errMessage', {
        title: "Something broke!",
        message:"Sorry, accessLogStream failed. Maybe try again?",
        link:"/",
    });
})

app.use("/confirmed", async (req, res) => {
    await User.findByIdAndUpdate(req.session.user._id, {emailConfirmed: true})
    res.render('message', {
        title: "Thanks for confirming your contact details!",
        message:"you can now login",
        link:"/",
    });
})
//
app.use("/logged-in-page", isLoggedIn, (req, res) => {
    res.render('logged-in-page.ejs', {
        title: 'logged-in page - only visible to people that are logged in!',
        user: req.session.user,
        sessionID: req.sessionID
    })
})
//
app.use("/admin-page", isAdmin, (req, res) => {
    res.render('admin-page.ejs', {
        title: 'admin page -  only visible to people that are admin!',
        user: req.session.user,
        sessionID: req.sessionID
    })
})
//
app.use("/errMessage", isLoggedIn, (req, res) => {
    res.render('errMessage.ejs', {
        title: 'protected message page - this page is only visible to people that are logged in!',
        user: req.session.user,
        sessionID: req.sessionID
    })
})
//
app.use("/", (req, res) => {
    res.render('index.ejs', {
        title: 'rocnogu-express index page',
        user: req.session.user,
        sessionID: req.sessionID
    })
})
//app.use
app.use("/users", usersRoutes)
/////////////////////////////////
// routes/stories.js
app.post("/stories", async (req, res) => {
    console.log("POST recieved", req.body)
    const storie = await Storie.create(req.body)
    res.status("200")
    res.end()
})
app.get("/stories", async (req, res) => {    
    const stories = await Storie.find()
    res.send(stories)
})
app.get("/stories/:id", async (req, res) => {   
    const storie = await Storie.findById(req.params.id)
    res.send(storie)
})
app.put("/stories/:id", async (req, res) => {   
    const updatedStorie = await Storie.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.send(updatedStorie)
})
app.delete("/stories/:id", async (req, res) => {
    await Storie.findByIdAndDelete(req.params.id)
    res.send("Storie deleted")
})

// routes/recipes.js
app.get("/recipes", async (req, res) => {    
    const recipes = await Recipe.find()
    res.send(recipes)
})
app.get("/recipe/:id", async (req, res) => {   
    const recipe = await Recipe.findById(req.params.id)
    res.send(recipe)
})
app.post("/recipes", async (req, res) => {
    console.log("POST recieved", req.body)
    const recipe = await Recipe.create(req.body)
    res.status("200")
    res.send(recipe)

})
app.put("/recipes/:id", async (req, res) => {   
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.send(updatedRecipe)
})
app.delete("/recipes/:id", async (req, res) => {
    await Recipe.findByIdAndDelete(req.params.id)
    res.send("Recipe deleted")
})


/////////////////////////////////

connectToDatabase().then((error) => {
    if (error) {
        console.log(error)
        return process.exit(1)
    }
    mongoose.connect(process.env.MONGO_URI, async ()=>{
        console.log("server is running " + PORT)
        app.listen(PORT)
      })
})