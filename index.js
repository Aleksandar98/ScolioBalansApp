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
        const noviKorisnik= {Ime: ime, Prezime: prezime, brojPreostalihTreninga: 0, individualniDatumi: [], grupniDatumi:[], testDatumi:[],
           ukupnoDuguje:{test:0,individualni:0,grupni:0},trenutnoAktivnaGrupa:"",testDatumPlacanja:[],platio:{test:0,individualni:0,grupni:0},
           cenaCustomIndividualni:-1,cenaCustomGrupni:"0_0",poslednjaIndividualnaGrupa:"0_otvoreno"};
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

app.post('/deleteKorisnik', (req,res)=>{
  const ime= req.body.Ime;
  const prezime= req.body.Prezime;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");


        dbo.collection("Korisnici").deleteOne({Ime: ime, Prezime: prezime}, (err,result)=>{
          if(err) throw err;
          console.log("Obrisan je korisnik.");
          res.json(true);
          db.close();
        })
      

    });
  });



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

app.get('/vratiIsticeGrupa', (req,res)=>{
  MongoClient.connect(url, async  function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase"); 
    let found = await dbo.collection("Korisnici").find({brojPreostalihTreninga: {$gt: 0, $lt:5}}, {projection:{_id:0, Ime:1,Prezime:1, brojPreostalihTreninga:1}}).toArray();
   console.log(found)
    db.close();
    res.send(found);
  }); 
})

app.get('/vratiIsteklaGrupa', (req,res)=>{
  MongoClient.connect(url, async  function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase"); 
    let found = await dbo.collection("Korisnici").find({brojPreostalihTreninga: {$lt:1}}, {projection:{_id:0, Ime:1,Prezime:1, brojPreostalihTreninga:1}}).toArray();
    db.close();
    res.send(found);
  }); 
})

app.post('/zapamtiCustomTrening', (req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");
    dbo.collection("Korisnici").findOne({Ime: req.body.Ime, Prezime:req.body.Prezime}, function(err, result) {
      if (err) throw err;
      if(result!=null){


          dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {cenaCustomIndividualni:req.body.Suma}})


       
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

app.post('/zapamtiCustomGrupni', (req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");
    dbo.collection("Korisnici").findOne({Ime: req.body.Ime, Prezime:req.body.Prezime}, function(err, result) {
      if (err) throw err;
      if(result!=null){

          console.log(req.body)
          dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {cenaCustomGrupni:req.body.izabraniBrojTreninga+"_"+req.body.Suma}})


       
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
//upisivanje
app.post('/dodajIndividualniDatum', (req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");
    dbo.collection("Korisnici").findOne({Ime: req.body.Ime, Prezime:req.body.Prezime}, function(err, result) {
      if (err) throw err;
      if(result!=null){
        let suma= result.ukupnoDuguje.individualni + req.body.Suma;
        let danasnjiDatum= new Date();
        var dd = String(danasnjiDatum.getDate()).padStart(2, '0');
        var mm = String(danasnjiDatum.getMonth() + 1).padStart(2, '0'); 
        var yyyy = danasnjiDatum.getFullYear();


        let procitanaIndGrupa = parseInt( result.poslednjaIndividualnaGrupa.split('_')[0])

        if(req.body.daLiCustomTreningPromena){
          dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {cenaCustomIndividualni:req.body.Suma}})
        }

        if(result.poslednjaIndividualnaGrupa.split('_')[1] === 'zatvoreno'){
          procitanaIndGrupa = procitanaIndGrupa + 1
          let novaVrednost = procitanaIndGrupa + '_otvoreno'
       
          dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {poslednjaIndividualnaGrupa:novaVrednost}})
        }
        console.log("pose ifa sam " + procitanaIndGrupa)
        danasnjiDatum = dd + '.' + mm + '.' + yyyy +"_"+procitanaIndGrupa;
        dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {"ukupnoDuguje.individualni":suma}, $push: {individualniDatumi: danasnjiDatum }} )
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

        console.log(req.body)
        let preostaliTreninzi= result.brojPreostalihTreninga - 1;
        let danasnjiDatum= new Date();
        var dd = String(danasnjiDatum.getDate()).padStart(2, '0');
        var mm = String(danasnjiDatum.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = danasnjiDatum.getFullYear();
        danasnjiDatum = dd + '.' + mm + '.' + yyyy;
        //nadji prvi datum sa 9999 u godini iz result.grupniDatumi[]
      
        let grupniDatumiTemp = result.grupniDatumi;

        console.log(grupniDatumiTemp);
        let indexEl,prviDatum;
        for(let i=0;i<grupniDatumiTemp.length;i++){
          if(grupniDatumiTemp[i].includes("9999")){
            indexEl = i
            prviDatum = grupniDatumiTemp[i]
            console.log(indexEl);
            break
          }
        }

        let gurpaPrvogDatuma = prviDatum.split('_')[1]
        grupniDatumiTemp.splice(indexEl,1)
        grupniDatumiTemp.splice(indexEl,0,danasnjiDatum+'_'+gurpaPrvogDatuma)
        //uzmi njegov broj grupe
      
        console.log("-----------------");
        //obrisi taj datum iz baze
        dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime},{$set:{grupniDatumi:grupniDatumiTemp, brojPreostalihTreninga:preostaliTreninzi}})
        // dodaj danasnji _ broj grupe obrisanog 
        console.log(grupniDatumiTemp);


      //  dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {ukupnoDuguje:suma, brojPreostalihTreninga:preostaliTreninzi}, $push: {grupniDatumi: danasnjiDatum }} )
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
        let suma= result.ukupnoDuguje.test + req.body.Suma;
        let danasnjiDatum= new Date();
        var dd = String(danasnjiDatum.getDate()).padStart(2, '0');
        var mm = String(danasnjiDatum.getMonth() + 1).padStart(2, '0'); 
        var yyyy = danasnjiDatum.getFullYear();

        danasnjiDatum = dd + '.' + mm + '.' + yyyy;
        dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {"ukupnoDuguje.test":suma},$push:{testDatumi:danasnjiDatum}});
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

        let poslednjiDatum = result.grupniDatumi[result.grupniDatumi.length-1]
      
        let grupaBr;
        if(poslednjiDatum!=null){
            let datum1 = poslednjiDatum.split('.')
  
            let godina1 = datum1[2]  

            

            if(godina1.split('_').length>2){  
               grupaBr = godina1.split('_')[2]
     
            }else{
               grupaBr = godina1.split('_')[1]
            }
          }else{
            grupaBr = "0"
          }

          danasnjiDatum = dd + '.' + mm + '.' + yyyy + "_" + req.body.Uplaceno + "_" + grupaBr;
          let danasnjiDatumBezGrupe = dd + '.' + mm + '.' + yyyy
          let danasnjiDatumZaUplatu = dd + '.' + mm + '.' + yyyy + "_" + req.body.Uplaceno + "_1" 
         if(result.ukupnoDuguje.test > result.platio.test){
            let razlika = result.ukupnoDuguje.test - result.platio.test
            if(razlika < req.body.Uplaceno){
              dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {"platio.test":result.ukupnoDuguje.test},$push:{testDatumPlacanja:danasnjiDatumBezGrupe} })

              let prenos = req.body.Uplaceno - razlika
              //UPLATI PRENOS ZA INDIV
              let novaVrednostInd= result.platio.individualni + prenos;
              danasnjiDatumZaUplatu = danasnjiDatumBezGrupe + '_'+prenos+'_1'
              dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {"platio.individualni":novaVrednostInd}, $push: {individualniDatumi:danasnjiDatumZaUplatu} })

              //AKO ODMAH UPLATI VELIKU KOLICINU NE PRENESE SE NA GRUPNE
              let razlika2 = result.ukupnoDuguje.individualni - result.platio.individualni;
              // if(){

              // }

            }else{
              let novaVrednostDugaTest = result.platio.test + req.body.Uplaceno
              dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {"platio.test":novaVrednostDugaTest},$push: {testDatumPlacanja:danasnjiDatumBezGrupe} })
            }

         }else if(result.ukupnoDuguje.individualni > result.platio.individualni){
            //PLACANJE JE ZA INDIVIDUALNI
            let razlika = result.ukupnoDuguje.individualni - result.platio.individualni
              if(razlika < req.body.Uplaceno){
                //JAVLJA SE PRENOS
                let prenos = req.body.Uplaceno - razlika
                //UPLATI RAZLIKU ZA INDIVIDUALNI 
                let novaVrednostInd= result.platio.individualni + razlika;
                danasnjiDatumZaUplatu = dd + '.' + mm + '.' + yyyy + "_" + razlika + "_1" 
                dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {"platio.individualni":novaVrednostInd}, $push: {individualniDatumi:danasnjiDatumZaUplatu} })

                //UPLATI PRENOS ZA GRUPU
                let novaVrednostGrup= result.platio.grupni + prenos;
                
               danasnjiDatum = dd + '.' + mm + '.' + yyyy + "_" + prenos + "_" + grupaBr;
                dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {"platio.grupni":novaVrednostGrup}, $push: {grupniDatumi:danasnjiDatum} })
              }else{
                // NEMA PRENOSA SAMO UPLATI KOLICINU ZA INDIVIDUALNI
                let novaVrednostInd= result.platio.individualni +  req.body.Uplaceno;
                dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {"platio.individualni":novaVrednostInd}, $push: {individualniDatumi:danasnjiDatumZaUplatu} })
              }
          }else{
            //INDIVIDUALNI PLACENI PLACANJE JE ZA GRUPU
            let novaVrednostGrup= result.platio.grupni + req.body.Uplaceno;
            dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {"platio.grupni":novaVrednostGrup}, $push: {grupniDatumi:danasnjiDatum} })
          }

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

app.post('/kreirajNovuGrupu', (req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");
    dbo.collection("Korisnici").findOne({Ime: req.body.Ime, Prezime:req.body.Prezime}, function(err, result) {
      if (err) throw err;
      if(result!=null){
        let poslednjiDatum = result.grupniDatumi[result.grupniDatumi.length-1]
        let izabraniBrojTreninga = req.body.izabraniBrojTreninga
        let cenaTreninga = req.body.Suma;
        let grupaBr;

        let trenutnoAktivnaGrupa = "";

        if(req.body.isDrugiClan)
        trenutnoAktivnaGrupa = izabraniBrojTreninga + '_2'
        else
        trenutnoAktivnaGrupa = izabraniBrojTreninga

        if(poslednjiDatum == null){
          grupaBr = "0"
        }else{

       
      
       
            let datum1 = poslednjiDatum.split('.')

            let godina1 = datum1[2]  
           

            if(godina1.split('_').length>2){

               grupaBr = godina1.split('_')[2]
        
            }else{
               grupaBr = godina1.split('_')[1]

            }
          }
            
          if(result.poslednjaIndividualnaGrupa.split('_')[1] === 'otvoreno'){
            let novaGrupa = parseInt( result.poslednjaIndividualnaGrupa.split('_')[0])
            let novaVrednost = novaGrupa + '_zatvoreno'
         
            dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {poslednjaIndividualnaGrupa:novaVrednost}})
          }
            //AKO NEMA GRUPA MORA IZ INDIVIDUALNIH DA SE VADI

            let prazniDatum = "01.01.9999_"+(parseInt(grupaBr)+1)
            let novaVrednostDuga = result.ukupnoDuguje.grupni + 4*izabraniBrojTreninga*cenaTreninga
            console.log(novaVrednostDuga)
            var i
            for(i=0;i<izabraniBrojTreninga*4;i++)
            dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {trenutnoAktivnaGrupa:trenutnoAktivnaGrupa+"",brojPreostalihTreninga:izabraniBrojTreninga*4,"ukupnoDuguje.grupni":novaVrednostDuga}, $push: {grupniDatumi: prazniDatum }} )

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
app.post('/dodajOpisGrupi', (req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");
    dbo.collection("Korisnici").findOne({Ime: req.body.Ime, Prezime:req.body.Prezime}, function(err, result) {
      if (err) throw err;
      if(result!=null){
        req.body.opis;
        let isGrupni = req.body.isGrupni;
        let brGrupe = req.body.brGrupe;
        let opis = req.body.opisGrupe;

        if(isGrupni){
          dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime,"opisiGrupa.grupOpisi":{$elemMatch:{$:"test"}}}, {$set: {"opisiGrupa.grupOpisi":"aaaa"}});

        }else{

        }
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
app.get('/vratiCeoObjekat/:ime', (req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");
    var imePrezime = req.params.ime.split('_')
    dbo.collection("Korisnici").findOne({Ime: imePrezime[0], Prezime:imePrezime[1]}, function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close(); 
      res.json(result);
    });
  });
})
app.get('/vratiDatume/:ime', (req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");
    var imePrezime = req.params.ime.split('_')
    dbo.collection("Korisnici").findOne({Ime: imePrezime[0], Prezime:imePrezime[1]},{projection:{_id:0, individualniDatumi:1, grupniDatumi:1 }}, function(err, result) {
      if (err) throw err;
      let konacanNiz = {};
      result.individualniDatumi.map((datum) => { 
        let ddmmyyyy = datum.split('.');
        let dan = ddmmyyyy[0];
        let mesec = ddmmyyyy[1];
        let godina = ddmmyyyy[2];

        if( konacanNiz[godina] == null)
        konacanNiz[godina] = [];

        //konacanNiz[godina].push(mesec);

        //if( konacanNiz[godina][mesec] == null)
        konacanNiz[godina][mesec];

        konacanNiz[godina][mesec].push(dan)
       
      

       })
       console.log(konacanNiz)

      db.close(); 
      res.json(result);
    });
  });
})

//------------------TODO---------

app.post('/deleteDatum', (req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");
    dbo.collection("Korisnici").findOne({Ime: req.body.Ime, Prezime:req.body.Prezime}, function(err, result) {
      if (err) throw err;
      if(result!=null){
        let isGrupni = req.body.isGrupni;
        let datumKliknut = req.body.datumKliknut
        let grupaZaBrisanje = req.body.grupaZaBrisanje
        
        if(isGrupni){

          let noviGrupniDatumi = result.grupniDatumi;

          let grupaBr = datumKliknut.split('_')[1]
  
          for(let i=0;i<noviGrupniDatumi.length;i++){
            if(noviGrupniDatumi[i] === datumKliknut){
              noviGrupniDatumi.splice(i, 1); 
              break
            }
          }

          let grupaTada = grupaZaBrisanje

          if(req.body.drugoDete)
          grupaTada = grupaZaBrisanje+'_2'


          let noviDug = result.ukupnoDuguje.grupni - cenaTerminaZaGrupu(grupaTada)
          dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {grupniDatumi:noviGrupniDatumi,"ukupnoDuguje.grupni":noviDug}});

        }else{
          let noviIndividualniDatumi = result.individualniDatumi;

          let grupaBr = datumKliknut.split('_')[1]
  
          for(let i=0;i<noviIndividualniDatumi.length;i++){
            if(noviIndividualniDatumi[i] === datumKliknut){
              noviIndividualniDatumi.splice(i, 1); 
              break
            }
          }

          let zaSmanjiti = 2000;
          if(req.body.drugoDete)
          zaSmanjiti = 1500;
          let noviDug = result.ukupnoDuguje.individualni - zaSmanjiti;
          dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {individualniDatumi:noviIndividualniDatumi,"ukupnoDuguje.individualni":noviDug}});
        }
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

function cenaTerminaZaGrupu(termin){
  switch (termin) {
    case "1":
      return 800;
      break;
    case "1_2":
      return 500;
      break;

    case "2":
      return 750;
      break;
    case "2_2":
      return 450;
      break;
    case "3":
      return 660;
     break;
    case "3_2":
      return 400;
     break;
    case "4":
      return 625;
     break;
    case "4_2":
      return 375;
     break;
    case "5":
      return 550;
     break;
    case "5_2":
      return 330;
     break;


    default:


      break;
  }
}

app.post('/deletePrazanTermin', (req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");
    dbo.collection("Korisnici").findOne({Ime: req.body.Ime, Prezime:req.body.Prezime}, function(err, result) {
      if (err) throw err;
      if(result!=null){
        let datumKliknut = req.body.datumKliknut

          let noviGrupniDatumi = result.grupniDatumi;

          let grupaBr = datumKliknut.split('_')[1]
  
          for(let i=0;i<noviGrupniDatumi.length;i++){
            if(noviGrupniDatumi[i] === datumKliknut){
              noviGrupniDatumi.splice(i, 1); 
              break
            }
          }

          let smanjenDugZaGrupne = result.ukupnoDuguje.grupni - cenaTerminaZaGrupu(result.trenutnoAktivnaGrupa)
          let smanjenBrojPreostalihTreninga = result.brojPreostalihTreninga - 1;

          dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {grupniDatumi:noviGrupniDatumi,"ukupnoDuguje.grupni":smanjenDugZaGrupne,brojPreostalihTreninga:smanjenBrojPreostalihTreninga}});

        
      }
      else{
        db.close();
        res.json(false);
      }
    });
  });
})

//ZAVRSI-------------
app.post('/deleteDatumUplata', (req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");
    dbo.collection("Korisnici").findOne({Ime: req.body.Ime, Prezime:req.body.Prezime}, function(err, result) {
      if (err) throw err;
      if(result!=null){
        let isGrupni = req.body.isGrupni;
        let datumKliknut = req.body.datumKliknut


        
        if(isGrupni){

          let noviGrupniDatumi = result.grupniDatumi;

          let grupaBr = datumKliknut.split('_')[2]
  
          console.log(noviGrupniDatumi)
          
          for(let i=0;i<noviGrupniDatumi.length;i++){
            if(noviGrupniDatumi[i] === datumKliknut){
              noviGrupniDatumi.splice(i, 1); 
              break
            }
          }
          let zaPromeniti = datumKliknut.split('_')[1];
          let novaSuma = result.platio.grupni - zaPromeniti;

          dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {grupniDatumi:noviGrupniDatumi,"platio.grupni":novaSuma}});

        }else{
          let noviIndividualniDatumi = result.individualniDatumi;

          let grupaBr = datumKliknut.split('_')[1]
  
          for(let i=0;i<noviIndividualniDatumi.length;i++){
            if(noviIndividualniDatumi[i] === datumKliknut){
              noviIndividualniDatumi.splice(i, 1); 
              break
            }
          }

          let zaPromeniti = datumKliknut.split('_')[1];
          let novaSuma = result.platio.individualni - zaPromeniti;
          dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {individualniDatumi:noviIndividualniDatumi,"platio.individualni":novaSuma}});
        }
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


// UPDATE ZA SVE OVE DAUTME
app.post('/izmeniDatum', (req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");
    dbo.collection("Korisnici").findOne({Ime: req.body.Ime, Prezime:req.body.Prezime}, function(err, result) {
      if (err) throw err;
      if(result!=null){
        let isGrupni = req.body.isGrupni;
        let datumKliknut = req.body.datumKliknut
        let datum = req.body.Datum;


        
        if(isGrupni){

          let noviGrupniDatumi = result.grupniDatumi;

          let grupaBr = datumKliknut.split('_')[1]
  
          for(let i=0;i<noviGrupniDatumi.length;i++){
            if(noviGrupniDatumi[i] === datumKliknut){
             
              noviGrupniDatumi[i] = datum+"_"+grupaBr
              break
            }
          }

          dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {grupniDatumi:noviGrupniDatumi}});

        }else{
          console.log("USAO")
          let noviIndividualniDatumi = result.individualniDatumi;

          let grupaBr = datumKliknut.split('_')[1]
  
          for(let i=0;i<noviIndividualniDatumi.length;i++){
            if(noviIndividualniDatumi[i] === datumKliknut){
             
              noviIndividualniDatumi[i] = datum+"_"+grupaBr
              break
            }
          }

          dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {individualniDatumi:noviIndividualniDatumi}});
        }
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


app.post('/izmeniDatumUplata', (req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");
    dbo.collection("Korisnici").findOne({Ime: req.body.Ime, Prezime:req.body.Prezime}, function(err, result) {
      if (err) throw err;
      if(result!=null){
        let isGrupni = req.body.isGrupni;
        let datumKliknut = req.body.datumKliknut
        let datumUplata = req.body.DatumUplata;


        
        if(isGrupni){

          let noviGrupniDatumi = result.grupniDatumi;

          let grupaBr = datumKliknut.split('_')[2]
  
          for(let i=0;i<noviGrupniDatumi.length;i++){
            if(noviGrupniDatumi[i] === datumKliknut){
             
              noviGrupniDatumi[i] = datumUplata+"_"+grupaBr
              break
            }
          }
          let razlika = datumKliknut.split('_')[1] - datumUplata.split('_')[1]
          console.log(razlika)
          let novaKolicinaUplate = result.platio.grupni - razlika
          dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {grupniDatumi:noviGrupniDatumi,"platio.grupni":novaKolicinaUplate}});

        }else{
          console.log("USAO")
          let noviIndividualniDatumi = result.individualniDatumi;

          let grupaBr = datumKliknut.split('_')[2]
  
          for(let i=0;i<noviIndividualniDatumi.length;i++){
            if(noviIndividualniDatumi[i] === datumKliknut){
             
              noviIndividualniDatumi[i] = datumUplata+"_"+grupaBr
              break
            }
          }
          let razlika = datumKliknut.split('_')[1] - datumUplata.split('_')[1]
          console.log(razlika)
          let novaKolicinaUplate = result.platio.individualni - razlika
          dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {individualniDatumi:noviIndividualniDatumi,"platio.individualni":novaKolicinaUplate}});
        }
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

//POVRACAJ NOVCA
app.post('/vratiNovac', (req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ScolioDatabase");
    dbo.collection("Korisnici").findOne({Ime: req.body.Ime, Prezime:req.body.Prezime}, function(err, result) {
      if (err) throw err;
      if(result!=null){
        let kolicinaNovca= req.body.Kolicina;
        let tipVracanje = req.body.TipVracanja;

        
        var danasnjiDatum = new Date();
        var dd = String(danasnjiDatum.getDate()).padStart(2, '0');
        var mm = String(danasnjiDatum.getMonth() + 1).padStart(2, '0'); 
        var yyyy = danasnjiDatum.getFullYear();

        let poslednjiDatum = result.grupniDatumi[result.grupniDatumi.length-1]
      
        let grupaBr;
        if(poslednjiDatum!=null){
            let datum1 = poslednjiDatum.split('.')
  
            let godina1 = datum1[2]  

            

            if(godina1.split('_').length>2){  
               grupaBr = godina1.split('_')[2]
     
            }else{
               grupaBr = godina1.split('_')[1]
            }
          }else{
            grupaBr = "0"
          }

          danasnjiDatum = dd + '.' + mm + '.' + yyyy + "_" + -kolicinaNovca + "_" + grupaBr;
          let danasnjiDatumZaUplatu = dd + '.' + mm + '.' + yyyy + "_" + -kolicinaNovca + "_1" 



        if(tipVracanje == "Grupa"){
          let novaVrednostGrupe = result.platio.grupni - kolicinaNovca
          dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {"platio.grupni":novaVrednostGrupe}, $push: {grupniDatumi:danasnjiDatum}});

        }else{
          let novaVrednostIndividualni = result.platio.individualni - kolicinaNovca
          dbo.collection("Korisnici").updateOne({Ime:req.body.Ime, Prezime:req.body.Prezime}, {$set: {"platio.individualni":novaVrednostIndividualni}, $push: {individualniDatumi:danasnjiDatumZaUplatu}});

        }
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







const PORT = process.env.PORT || 5000;
app.listen(PORT);