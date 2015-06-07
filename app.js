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


app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb'}));

app.use(bodyParser({limit: '50mb'}));

app.get('/',function(req,res){
  res.json({info: "webservice de pilas-engine-bloques en funcionamiento."});
});

app.post('/sendMessage', function(req, res) {
  var message = req.body.message;
  console.log(req.body);
  var media = req.body.media;
  var filename = "_tmp_imagen" + 123123 + ".png";


  var base64Data = media.replace(/^data:image\/png;base64,/, "");

  require("fs").writeFile(filename, base64Data, 'base64', function(err) {
    if (err) {
      console.log(err);
      res.json({status: "error", message: err});
    } else {
      sendMessage(message, filename);
      res.json({status: "ok", message: message, media:media});
    }
  });

});

app.listen(3000, function(){
  console.log("Iniciando aplicación en http://localhost:3000");
});
