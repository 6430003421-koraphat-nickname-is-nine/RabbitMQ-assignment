const amqp = require("amqplib/callback_api");

const routingKeys = process.argv.slice(2);

if (routingKeys.length === 0) {
  routingKeys.push("order.food.#"); // Default binding to receive all food orders
}

console.log("Binding to routing keys:", routingKeys);

amqp.connect("amqp://localhost", (error0, connection) => {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    const exchange = "orders";
    channel.assertExchange(exchange, "topic", { durable: true });

    channel.assertQueue("", { exclusive: true }, (error2, q) => {
      if (error2) {
        throw error2;
      }

      console.log(` [*] Waiting for messages in queue. To exit press CTRL+C`);

      routingKeys.forEach((key) => {
        console.log(` [*] Binding to routing key: ${key}`);
        channel.bindQueue(q.queue, exchange, key);
      });

      channel.consume(q.queue, (msg) => {
        if (msg) {
          const order = JSON.parse(msg.content.toString());
          const now = new Date().toLocaleString();
          const secs = order.quantity; // Simulate processing time based on quantity

          console.log(
            ` [${now}] [x] Received order: ${order.name}, quantity: ${order.quantity}`
          );

          setTimeout(() => {
            const now2 = new Date().toLocaleString();
            console.log(
              ` [${now2}] [x] Done processing order for ${order.name}`
            );
            channel.ack(msg);
          }, secs * 1000); // Simulate processing time
        }
      });
    });
  });
});
