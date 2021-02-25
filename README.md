# Grafana, Prometheus, Nginx and Rabbit-mq

This is a project to test Grafana monitoring utility, with an Nginx and Rabbit-mq.

To test it, a sample project has been included in order to obtain some metrics. The project just get request from nginx, route them through an express app, and this app enqueue these json messages to a queue.

To setup the targeted project, just run: 

```
docker-compose up
```

To check everything is running correctly, launch this from another terminal:

```
curl -X POST -H "Content-Type: application/json" -d '{"amount": 100}' http://localhost:8080/purchase
```

To bring up Prometheus and Grafana run:

```
docker-compose -f docker-compose-grafana.yml up
```

## Graphana

Open grafana interface: [http://localhost:3300](http://localhost:3300)

To learn how to query prometheus data with grafana take a look to this:

https://grafana.com/docs/grafana/latest/features/datasources/prometheus/#query-editor

### Examples

Query for nginx graphic:

```
delta(nginx_http_requests_total{job="nginx-job"}[2m])
```


