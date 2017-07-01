//Hungarian quality software

var mongo = require('mongodb');

var processTweet = require('./processTweet');
var getTweet = require('./getTweet');

//module.exports = {
  //update : function(){
  function update(){
    var mongoClient = mongo.MongoClient;

    var url = "mongodb://localhost:27017/local";

    var sources = [{}];

    mongoClient.connect(url, function(error, db){
      if(error){
        console.log("Unable to connect to database, error: ", error);
      }else {

        db.collection('sources').find({}).toArray(function(error, result){
          if(error){
            console.log("Unable to access collection!");

            res.send(error);
          }else if (result.length) {
            for (var i = 0; i < result.length; i += 1){
              console.log(result[i].name);
              getTweet.getTweet(result[i].name, function(res, code){
                if(res != null){
                  res = JSON.parse(res);
                  for (var i in res) {
                    processTweet.processTweet(res[i], function(ret){

                      db.collection('tweets').insertOne({
                        name:ret.name,
                        handle:ret.handle,
                        id:ret.id,
                        retweet_count:ret.retweet_count,
                        text:ret.text,
                        links:ret.links
                      }, function(err, res) {});
                    });
                  }
                }else {
                  console.log("Res is null! Code: " + code);
                }
              });
            }
          }else {
            console.log("No documents found!");
          }

          db.close();
        });
      }
    });
  }
  update();
//};

function insert(ret){

}