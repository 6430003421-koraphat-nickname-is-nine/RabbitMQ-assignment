//  Producer

const client = require("./client");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  // client.getAllMenu(null, (err, data) => {
  //   if (!err) {
  //     res.render("menu", {
  //       results: data.menu,
  //     });
  //   }
  // });
  client.getAllMenu(null, (err, data) => {
    if (err) {
      console.error("Error fetching menu:", err);
      res.status(500).send("Error fetching menu");
    } else {
      res.render("menu", { results: data.menu });
    }
  });
});

const amqp = require("amqplib/callback_api");

app.post("/placeorder", (req, res) => {
  var order = {
    id: req.body.id,
    name: req.body.name,
    quantity: req.body.quantity,
  };

  amqp.connect("amqp://localhost", (err0, connection) => {
    if (err0) {
      console.error("Failed to connect to RabbitMQ:", err0);
      res.status(500).send("Failed to place order");
      return;
    }
    connection.createChannel((err1, channel) => {
      if (err1) {
        console.error("Failed to create channel:", err1);
        res.status(500).send("Failed to place order");
        return;
      }
      var queue = "order_queue";
      channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)), {
        persistent: true,
      });
      console.log(" [x] Sent '%s'", order);
      res.status(200).send("Order placed successfully");
    });
  });
});
//console.log("update Item %s %s %d",updateMenuItem.id, req.body.name, req.body.quantity);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running at port %d", PORT);
  console.log("http://localhost:3000/");
});

//var data = [{
//   name: '********',
//   company: 'JP Morgan',
//   designation: 'Senior Application Engineer'
//}];
