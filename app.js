var fs = require('fs');

if (!fs.existsSync('config.json')) {
  console.error("Necesitas crear el archivo config.json, mirá config.json.example")
  process.exit(1);
}

var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var config = require('./config.json');
var Twitter = require('node-twitter');

var twitterRestClient = new Twitter.RestClient(
  config.key,
  config.secret,
  config.accessToken,
  config.secretToken
);


function sendMessage(message, media) {
    twitterRestClient.statusesUpdateWithMedia({
      'status': message,
      'media[]': media,
    }, function(error, result) {
      if (error) {
        console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
      }

      if (result) {
        console.log(result);
      }
    }
  );
}


app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',function(req,res){
  res.json({info: "webservice de pilas-engine-bloques en funcionamiento."});
});

app.post('/sendMessage', function(req, res) {
  var message = req.body.message;
  var media = req.body.media;

  console.log("message: " + message + "    media: " + media);

  sendMessage(message, media);

  res.json({status: "ok", message: message, media:media});
});

app.listen(3000, function(){
  console.log("Iniciando aplicación en http://localhost:3000");
});
