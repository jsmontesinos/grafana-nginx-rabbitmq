var express = require('express');
var app = express();

app.get('/by-ip/node-express/*', function (req, res) {
  res.send('Hello World!');
});

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});

process.on('SIGINT', () => {
    process.exit();
});