# Grafana, Prometheus, Nginx and Rabbit-mq

This is a project to test Grafana monitoring utility, with an Nginx and Rabbit-mq.

To test it, a sample project has been included in order to obtain some metrics. The project just get request from nginx, route them through an express app, and this app enqueue these json messages to a queue.