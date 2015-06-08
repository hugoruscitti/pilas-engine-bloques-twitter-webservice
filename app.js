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


function sendMessage(message, media, callback) {
    twitterRestClient.statusesUpdateWithMedia({
      'status': message,
      'media[]': media,
    }, function(error, result) {

      if (error) {
        var message = 'Error: ' + (error.code ? error.code + ' ' + error.message : error.message);
        console.log(message);
        callback(message, {});
      }

      if (result) {
        callback(null, {url: 'https://twitter.com/pilasBloques/status/' + result.id_str});
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
  var media = req.body.media;
  var filename = "_tmp_imagen" + 123123 + ".png";

  var base64Data = media.replace(/^data:image\/png;base64,/, "");

  require("fs").writeFile(filename, base64Data, 'base64', function(err) {

    if (err) {
      console.log(err);
      res.json({status: "error", message: err});
    } else {
      sendMessage(message, filename, function(err, data) {
        if (err) {
          res.json({status: "error", message: err});
        } else {
          res.json({status: "ok", message: message, url: data.url});
        }
      });
    }
  });

});

app.listen(3000, function(){
  console.log("Iniciando aplicación en http://localhost:3000");
});
