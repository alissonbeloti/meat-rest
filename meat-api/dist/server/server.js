"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import http = require('http');
const restify = require("restify");
const enviroment_1 = require("../common/enviroment");
const mongoose = require("mongoose");
//import { connect } from 'tls';
const error_handler_1 = require("./error.handler");
const token_parser_1 = require("../security/token.parser");
const fs = require("fs");
const logger_1 = require("../common/logger");
class Server {
    initializeDb() {
        return mongoose.connect(enviroment_1.enviroment.db.url, {
            useNewUrlParser: true,
        });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                const options = {
                    name: 'meat-api',
                    version: '0.0.1',
                    log: logger_1.logger
                };
                this.application.pre(restify.plugins.requestLogger({ log: logger_1.logger }));
                if (enviroment_1.enviroment.security.enabledHTTPS) {
                    options.certificate = fs.readFileSync(enviroment_1.enviroment.security.certificate);
                    options.key = fs.readFileSync(enviroment_1.enviroment.security.key);
                }
                this.application = restify.createServer(options);
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser()); //Para o método POST
                //this.application.use(mergePatchBodyParser)
                this.application.use(token_parser_1.tokenParser);
                this.application.listen(enviroment_1.enviroment.server.port, () => {
                    //console.log("API está rodando em http://localhost/1337")
                    resolve(this.application);
                });
                this.application.on('restifyError', error_handler_1.handleError);
                //this.application.on('after', restify.plugins.auditLogger(
                //    {
                //        log: logger,
                //        event: 'after'
                //    }
                //)) //tomar cuidado para não logar o token
                this.application.get('/hello', (req, resp, next) => {
                    resp.contentType = 'application/json';
                    resp.send({
                        message: 'Hello',
                    });
                    //resp.json({ message: 'Hello' })
                    return next();
                });
                //Rotas
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                //this.application.get('/info', [
                //    (req, resp, next) => {
                //        return next()
                //    },
                //    (req, resp, next) => {
                //        resp.contentType = 'application/json'
                //        resp.send({
                //            browser: req.userAgent(),
                //            method: req.method,
                //            url: req.href(),
                //            path: req.path(),
                //            queryString: req.query,
                //        })
                //        return next()
                //    }])
                //this.application.on('error', (err));
            }
            catch (e) {
                reject(e);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initializeDb().then(() => this.initRoutes(routers).then(() => this)); // 
    }
    shutdown() {
        return mongoose.disconnect().then(this.application.close());
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map