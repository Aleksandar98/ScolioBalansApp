var MongoClient = require('mongodb').MongoClient;



MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  // Client returned
  var db = client.db('ScolioDatabase');

  if(err) throw err;

  db.collection('Korisnici', function (err, collection) {
     
     collection.find().toArray(function(err, items) {
        if(err) throw err;    
        console.log(items);            
    });
    
    });
});
