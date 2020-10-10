"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const users_router_1 = require("./users/users.router");
const restaurants_router_1 = require("./restaurants/restaurants.router");
const reveiw_router_1 = require("./reviews/reveiw-router");
const server = new server_1.Server();
server.bootstrap([
    users_router_1.usersRouter,
    restaurants_router_1.restaurantsRouter,
    reveiw_router_1.reviewsRouter
]).then(server => {
    console.log('Server is listening on :', server.application.address());
}).catch(error => {
    console.log('Servidor falhou ao iniciar');
    console.error(error);
    process.exit(1); // 1=> Saída anormal
});
//var port = process.env.port || 1337
//http.createServer(function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'text/plain' });
//    res.end('Hello World\n');
//}).listen(port);
//console.log("main script")
//console.log("main script")
//# sourceMappingURL=server.js.map