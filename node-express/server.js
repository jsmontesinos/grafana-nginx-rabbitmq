var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('OK')
});

app.post('/', function (req, res) {
  res.send('OK');
});

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});

process.on('SIGINT', () => {
    process.exit();
});