const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const amqp = require('amqplib/callback_api');

const queue = 'hello';
let queueChannel;
let queueConnection;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.send('OK')
});

app.post('/', function (req, res) {
  const msg = req.body;
  console.log("Message received: ", msg);
  queueChannel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
  res.send('OK');
});

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
  setTimeout(() => createQueue(), 20000);
});

process.on('SIGINT', () => {
    queueConnection.close();
    process.exit();
});

function createQueue() {
  amqp.connect('amqp://rabbitmq', function(error0, connection) {
    if (error0) {
      throw error0;
    }
    queueConnection = connection;
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }
      
      channel.assertQueue(queue, {
        durable: false
      });

      queueChannel = channel;
      console.log('Queue started and ready');
    });
  });
}