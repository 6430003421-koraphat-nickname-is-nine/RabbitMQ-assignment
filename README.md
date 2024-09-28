hello

## How to start

1. in the main directory of these code: run `npm start`
2. cd to the RabbitMQ Docker folder and run `docker compose up -d`
3. cd to the server folder, then run `index kitchen.js`
   note that there should be specific keys such as `#.k.*`,`#.f.*`, `order.food.t.*` after this command
   for example `index kitchen.js #.k.*` for single binding or `index kitchen.js #.k.* #.t.*` for multiple binding.
4. cd to client folder, run `index index.js`, and open http://localhost:3000 on your browser
