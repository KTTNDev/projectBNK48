var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
const PORT = process.env.PORT || 5000

var app = express();
app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs');

var csrfProtection = csrf({ cookie : true });
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());
app.use(cookieParser());

var firebase = require('firebase');
require("firebase/firestore")
firebase.initializeApp({
    apiKey: "AIzaSyBYGDGflEX9-6jI8WBx13iR76LUcuInhCs",
    authDomain: "webfirebase-29858.firebaseapp.com",
    databaseURL: "https://webfirebase-29858.firebaseio.com",
    projectId: "webfirebase-29858",
    storageBucket: "webfirebase-29858.appspot.com",
    messagingSenderId: "882508723833"
});

var db = firebase.firestore();

app.get('/',function (req,res){

    var data_list = [];
    db.collection('BNK48SHOP').get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            obj1=doc.data();
            obj2={id :doc.id};
            obj3=Object.assign(obj1,obj2);
            data_list.push(obj3);
        });
    res.render('home',{data:data_list});
})
    .catch(err => {
       console.log('Error getting document',err);
    });
});
app.get('/list',function (req,res){
    var data_list = [];
    db.collection('BNK48SHOP').get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            obj1 = doc.data();
            obj2 = {id : doc.id};
            obj3 = Object.assign(obj1, obj2);
            data_list.push(obj3);
        })
        //console.log(data_list);
        res.render('list',{data:data_list});
    })
    .catch(err => {
        console.log('Error getting document', err);
    });
});

app.get('/delete/:id',function(req,res){
    var id=req.params.id;
    db.collection("BNK48SHOP").doc(id).delete()
    .then(function(){
        res.redirect('/list');
    });
});

app.get('/insert',function(req,res){
        res.render('insert');
    });

    app.post('/insert',function(req,res){
        db.collection('BNK48SHOP').add({
            PicProduct : req.body.PicProduct,
            PRODUCT : req.body.PRODUCT,
            PDDescription : req.body.PDDescription,
            Price : req.body.Price,
            sex : req.body.sex,
            province : req.body.province, 

        }).then(ref => {
            res.redirect('/list');
            res.redirect('/home');
        })
    });
    
    

app.get('/update/:id',function(req, res) {
    var id = req.params.id;
    var data_list = [] ;
    db.collection('BNK48SHOP').doc(id).get()
    .then(doc => {
        obj1 = doc.data();
        obj2 = {id : doc.id};
        data_list = Object.assign(obj1,obj2);
        res.render('update',data_list);
    })
    .catch(err => {
        console.log('Error getting document',err);
    });
});

app.post('/update',function(req, res) {
    db.collection("BNK48SHOP").doc(id).update({
        PicProduct : req.body.PicProduct,
        PRODUCT : req.body.PRODUCT,
        PDDescription : req.body.PDDescription,
        Price : req.body.Price,
        sex : req.body.sex,
        province : req.body.province,

    }).then(ref => {
        res.redirect('/list')
    });
});

app.listen(PORT,function() {
    console.log('Server Stared on localhost : 5000');
});