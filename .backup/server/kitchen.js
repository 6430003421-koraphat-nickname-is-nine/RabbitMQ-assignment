#!/usr/bin/env node

// Consumer (Kitchen)

var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", (error0, connection) => {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    var queue = "order_queue";

    channel.assertQueue(queue, {
      durable: true,
    });

    channel.prefetch(1);
    console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(
      queue,
      (msg) => {
        var order = JSON.parse(msg.content.toString());
        var secs = order.quantity; // Simulate processing time based on quantity

        var now = new Date().toLocaleString();

        console.log(
          ` [${now}] [x] Received order: ${order.name}, quantity: ${order.quantity}`
        );

        setTimeout(() => {
          var now2 = new Date().toLocaleString();
          console.log(` [${now2}] [x] Done processing order for ${order.name}`);
          channel.ack(msg);
        }, secs * 1000); // Simulate processing time
      },
      {
        noAck: false,
      }
    );
  });
});
