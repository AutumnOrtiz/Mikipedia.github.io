const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const mongodb = require('mongodb');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const methodOverride = require('method-override')
const http = require('http');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'uploads')
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({storage: storage});


//expressd object
const app = express();
mongoose.connect('mongodb://localhost:27017/Characters'); 

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))

const port = 5500;

const User = require("./models/characterinfo");
const { Router } = require('express');
const { userInfo } = require('os');

app.set("view engine", "ejs");


app.use('/public', express.static('public'));


http.createServer((req, res) => {
    console.log(req.url);
    if(req.url === '/') { 
        res.render('/index');
    }
});


// render pages //

app.get('/', (req,res)=> {
    res.render("index");
 });


 app.get('/search', (req,res)=> {
    res.render("search");
 });


 app.get('/edit', (req,res)=> {
    res.render("edit", {
        firstName: '', 
        lastName: '', 
        age: '',
        height: '', 
        occupation: '', 
        status: '', 
        image: '', 
        description: ''
    });
 });

app.post('/', async(req,res) =>{ 
    const data = new User(req.body);
    await data.save();
    res.redirect('/')


});









//my own stuff// 
const projection = {_id: 0, fname: 1, lname: 1};

app.get('/show', (req,res)=> {
    User.find().select('-_id').select('-__v').then((result)=> {
        res.json(result);
    }).catch((err)=> { 
        console.log(err);
    });
});




//search//
/* add value to search input and then find way to match with the database*/
app.post('/search', async(req,res)=>{
    User.find({ fname: req.body.search}).then((result)=> { 
        res.json(result); 
        
        console.log("successfully found");
    })
    .catch((err)=> {
        console.log(err);
    });
});

//delete//

app.post('/edit', async(req,res)=>{
User.deleteOne({fname : req.body.inputfirst, lname: req.body.inputlast }).then(function(){ 
    console.log("successfully deleted");
}).catch(function(error){ 
    console.log(error);
});
});

//edit//


app.post('/update', async(req,res)=>{ 
    var filter = {fname: req.body.findfirst, lname: req.body.findlast};
    var update = 
    {fname : req.body.fupdate, 
        lname : req.body.lupdate,
        age: req.body.aupdate, 
        height: req.body.hupdate, 
        occ: req.body.oupdate, 
        status: req.body.supdate, 
        img: req.body.iupdate, 
        desc: req.body.dupdate};
    console.log(update);
 const doc = await User.findOneAndUpdate(filter, update, { 
    new : true
}).then(function(){ 
    console.log("successfully updated");
    res.redirect('/');
    doc.save();
}).catch(function(error){ 
    console.log(error);
});
});

app.post('/find', async (req, res) => {
    const doc = await User.findOne({ $and: [{fname: req.body.findfirst}, {lname: req.body.findlast}] });
    console.log(doc);
    res.render('edit', {
        firstName: doc.fname, 
        lastName: doc.lname,
        age: doc.age,
        height: doc.height,
        occupation: doc.occ,
        status: doc.status,
        image: doc.img,
        description: doc.desc
    });
})








app.listen(port, ()=>{ 
    console.log(`App is listening on port ${port}`)
});




