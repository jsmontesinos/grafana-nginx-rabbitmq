const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const amqp = require('amqplib/callback_api');
const promClient = require('prom-client');

const queue = 'hello';
let queueChannel;
let queueConnection;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const requestCounter = new promClient.Counter({
  name: 'request_counter',
  help: 'a request reaching the server',
  labelNames: ['path']
});

const purchaseAmount = new promClient.Gauge({
  name: 'purchase_amount',
  help: 'purchase amounts gauge'
})

const purchaseAmountHistogram = new promClient.Histogram({
  name: 'purchase_amount_histogram',
  help: 'purchase amounts histogram',
  buckets: [1, 5, 10, 50, 100]
});

const purchaseAmountSummary = new promClient.Summary({
  name: 'purchase_amount_summary',
  help: 'purchase amounts summary',
  percentiles: [0.5],
});

const registry = new promClient.Registry();
promClient.collectDefaultMetrics({ register: registry });
registry.registerMetric(requestCounter);
registry.registerMetric(purchaseAmount);
registry.registerMetric(purchaseAmountHistogram);
registry.registerMetric(purchaseAmountSummary);

app.get('/cart', function (req, res) {
  requestCounter.inc({path: '/cart'});
  res.send('OK');
});

app.get('/me', function (req, res) {
  requestCounter.inc({path: '/me'});
  res.send('OK');
});

app.post('/purchase', (req, res) => {
  requestCounter.inc({path: '/purchase'});
  const { amount } = req.body;
  purchaseAmount.set({}, amount);
  purchaseAmountHistogram.observe(amount);
  purchaseAmountSummary.observe(amount);
  queueChannel.sendToQueue(queue, Buffer.from(JSON.stringify({ purchaseAmount: amount })));
  res.send('OK');
});

app.get('/metrics', (req, res) => {
  res.send(registry.metrics());
});

app.listen(5000, function () {
  console.log('Example app listening on port 5000!!');
  setTimeout(() => createQueue(), 10000);
});

process.on('SIGINT', () => {
    queueConnection.close();
    process.exit();
});

function createQueue() {
  amqp.connect('amqp://rabbitmq-server', function(error0, connection) {
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