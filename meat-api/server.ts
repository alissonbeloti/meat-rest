import http = require('http');
import * as restify from 'restify';

import { Server } from './server/server'
import { usersRouter } from './users/users.router';
import { restaurantsRouter } from './restaurants/restaurants.router';
import { reviewsRouter } from './reviews/reveiw-router';

const server = new Server()
server.bootstrap([
    usersRouter,
    restaurantsRouter,
    reviewsRouter
]).then(server => {
    console.log('Server is listening on :', server.application.address())
}).catch(error => {
    console.log('Servidor falhou ao iniciar')
    console.error(error);
    process.exit(1) // 1=> Saída anormal
})




//var port = process.env.port || 1337
//http.createServer(function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'text/plain' });
//    res.end('Hello World\n');
//}).listen(port);

//console.log("main script")
//console.log("main script")