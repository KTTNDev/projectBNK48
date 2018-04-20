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
    apiKey: "AIzaSyCdsDdqpPtBnPEoFxK7xHwxUgEZUfv_MDs",
    authDomain: "webfirebase-754d5.firebaseapp.com",
    databaseURL: "https://webfirebase-754d5.firebaseio.com",
    projectId: "webfirebase-754d5",
    storageBucket: "webfirebase-754d5.appspot.com",
    messagingSenderId: "919632307200"
  });

var db = firebase.firestore();


app.get('/insert',function(req, res) {
    res.render('insert');
});

app.post('/insert',function(req, res) {
    db.collection('users').add({
       
        card : req.body.card,
        dateofbirth : req.body.dateofbirth,
        sex : req.body.sex,
        fname : req.body.fname,
        lname : req.body.lname,
        address : req.body.address,
        province : req.body.province,
        zipcode : req.body.zipcode,

    }).then(ref => {
        res.redirect('/')
    });
});

app.get('/',function (req, res) {

    var data_list = [];
    db.collection('users').get()
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

app.get('/delete/:id',function(req, res) {
    var id = req.params.id;
    db.collection('users').doc(id).delete().then(function() {
        res.redirect('/');
    });

});
app.get('/update/:id',function(req, res) {
    var id = req.params.id;
    var data_list = [] ;
    db.collection('users').doc(id).get()
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
    db.collection("users").doc(id).update({
        card : req.body.card,
        dateofbirth : req.body.dateofbirth,
        sex : req.body.sex,
        fname : req.body.fname,
        lname : req.body.lname,
        address : req.body.address,
        province : req.body.province,
        zipcode : req.body.zipcode,
    }).then(ref => {
        res.redirect('/')
    });
});

app.listen(PORT,function() {
    console.log('Server Stared on localhost');
});