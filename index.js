const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
});


//home
app.post('/createKorisnik', (req,res)=>{
  const ime= req.body.Ime;
  const prezime= req.body.Prezime;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");
    dbo.collection("Korisnici").findOne({Ime: ime, Prezime: prezime}, function(err, result) {
      if (err) throw err;
      console.log(result);
      if(result==null){
        const noviKorisnik= {Ime: ime, Prezime: prezime, brojPreostalihTreninga: 0, individualniDatumi: [], grupniDatumi:[], testDatum:"", ukupnoDuguje:0};
        dbo.collection("Korisnici").insertOne(noviKorisnik, (err,result)=>{
          if(err) throw err;
          console.log("Dodat je novi korisnik.");
          res.json(true);
          db.close();
        })
      }
      else{
        db.close();
        res.json(false);
      }
    });
  });
})

app.get('/vratiNizStringova', (req,res)=>{
  MongoClient.connect(url, async  function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase"); 
    let found = await dbo.collection("Korisnici").find({}, {projection: {_id:0, Ime:1, Prezime:1 }}).toArray();
    let toSend= [];
    found.forEach(elem=>{
      toSend.push(elem.Ime + " " + elem.Prezime);
    })
    db.close();
    res.send(toSend);
  }); 
})

app.get('/vratiObjekte04', (req,res)=>{
  MongoClient.connect(url, async  function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase"); 
    let found = await dbo.collection("Korisnici").find({brojPreostalihTreninga: {$gt: 0, $lt:5}}, {projection:{_id:0, Ime:1,Prezime:1, brojPreostalihTreninga:1}}).toArray();
    db.close();
    res.send(found);
  }); 
})

app.get('/vratiObjekte0', (req,res)=>{
  MongoClient.connect(url, async  function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase"); 
    let found = await dbo.collection("Korisnici").find({brojPreostalihTreninga: 0}, {projection:{_id:0, Ime:1,Prezime:1, brojPreostalihTreninga:1}}).toArray();
    db.close();
    res.send(found);
  }); 
})


//upisivanje
app.post('/dodajIndividualniDatum', (req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");
    dbo.collection("Korisnici").findOne({Ime: req.body.Ime, Prezime:req.body.Prezime}, function(err, result) {
      if (err) throw err;
      if(result!=null){
        let suma= result.ukupnoDuguje + req.body.Suma;
        let danasnjiDatum= new Date();
        var dd = String(danasnjiDatum.getDate()).padStart(2, '0');
        var mm = String(danasnjiDatum.getMonth() + 1).padStart(2, '0'); 
        var yyyy = danasnjiDatum.getFullYear();

        danasnjiDatum = dd + '.' + mm + '.' + yyyy;
        dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {ukupnoDuguje:suma}, $push: {individualniDatumi: danasnjiDatum }} )
        db.close();
        res.json(true);
      }
      else{
        db.close();
        res.json(false);
      }
    });
  });
})

app.post('/dodajGrupniDatum', (req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");
    dbo.collection("Korisnici").findOne({Ime: req.body.Ime, Prezime:req.body.Prezime}, function(err, result) {
      if (err) throw err;
      if(result!=null){
        let suma= result.ukupnoDuguje + req.body.Suma;
        let preostaliTreninzi= result.brojPreostalihTreninga - 1;
        let danasnjiDatum= new Date();
        var dd = String(danasnjiDatum.getDate()).padStart(2, '0');
        var mm = String(danasnjiDatum.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = danasnjiDatum.getFullYear();

        danasnjiDatum = dd + '.' + mm + '.' + yyyy;
        dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {ukupnoDuguje:suma, brojPreostalihTreninga:preostaliTreninzi}, $push: {grupniDatumi: danasnjiDatum }} )
        res.json(true);
      }
      else{
        db.close();
        res.json(false);
      }
    });
  });
})

app.post('/dodajTestDatum', (req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");
    dbo.collection("Korisnici").findOne({Ime: req.body.Ime, Prezime:req.body.Prezime}, function(err, result) {
      if (err) throw err;
      if(result!=null){
        let danasnjiDatum= new Date();
        var dd = String(danasnjiDatum.getDate()).padStart(2, '0');
        var mm = String(danasnjiDatum.getMonth() + 1).padStart(2, '0'); 
        var yyyy = danasnjiDatum.getFullYear();

        danasnjiDatum = dd + '.' + mm + '.' + yyyy;
        dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {testDatum:danasnjiDatum}});
        db.close();
        res.json(true);
      }
      else{
        db.close();
        res.json(false);
      }
    });
  });
})

//placanje
app.post('/plati', (req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");
    dbo.collection("Korisnici").findOne({Ime: req.body.Ime, Prezime:req.body.Prezime}, function(err, result) {
      if (err) throw err;
      if(result!=null){
        var danasnjiDatum = new Date();
        var dd = String(danasnjiDatum.getDate()).padStart(2, '0');
        var mm = String(danasnjiDatum.getMonth() + 1).padStart(2, '0'); 
        var yyyy = danasnjiDatum.getFullYear();

        let noviDug= result.ukupnoDuguje - req.body.Uplaceno;
        danasnjiDatum = dd + '.' + mm + '.' + yyyy + "_" + req.body.Uplaceno;
        dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {ukupnoDuguje:noviDug}, $push: {grupniDatumi:danasnjiDatum, individualniDatumi:danasnjiDatum} })
        db.close(); 
        res.json(true);
      }
      else{
        db.close(); 
        res.json(false);
      }
    });
  });
})

//evidencija
app.get('/vratiCeoObjekat', (req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");
    dbo.collection("Korisnici").findOne({Ime: req.body.Ime, Prezime:req.body.Prezime}, function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close(); 
      res.json(result);
    });
  });
})

const PORT = process.env.PORT || 5000;
app.listen(PORT);