var fs = require('fs');

if (!fs.existsSync('config.json')) {
  console.error("Necesitas crear el archivo config.json, mirá config.json.example")
  process.exit(1);
}


var config = require('./config.json');
var Twitter = require('node-twitter');

var twitterRestClient = new Twitter.RestClient(
  config.key,
  config.secret,
  config.accessToken,
  config.secretToken
);

twitterRestClient.statusesUpdateWithMedia({
        'status': 'Posting a tweet w/ attached media.',
        'media[]': 'imagen.png'
    }, function(error, result) {
        if (error) {
            console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
        }

        if (result) {
            console.log(result);
        }
    }
);
