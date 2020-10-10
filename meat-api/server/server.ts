//import http = require('http');
import * as restify from 'restify';
import { enviroment } from '../common/enviroment';
import { Router } from '../common/router';
import * as mongoose from 'mongoose'
//import { connect } from 'tls';
import { handleError } from './error.handler'
import { tokenParser } from '../security/token.parser';
import * as fs from 'fs'
import { logger } from '../common/logger';
export class Server {
    application: restify.Server
    initializeDb() {
        
        return mongoose.connect(enviroment.db.url, {
            useNewUrlParser: true,
        })   
    }
    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const options: restify.ServerOptions = {
                    name: 'meat-api',
                    version: '0.0.1',
                    log: logger
                }

                this.application.pre(restify.plugins.requestLogger({ log: logger }))

                if (enviroment.security.enabledHTTPS) {
                    options.certificate = fs.readFileSync(enviroment.security.certificate)
                    options.key = fs.readFileSync(enviroment.security.key)
                }
                this.application = restify.createServer(options);

                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser()) //Para o método POST
                //this.application.use(mergePatchBodyParser)
                this.application.use(tokenParser)

                this.application.listen(enviroment.server.port, () => {
                    //console.log("API está rodando em http://localhost/1337")
                    resolve(this.application)
                })

                this.application.on('restifyError', handleError)
                //this.application.on('after', restify.plugins.auditLogger(
                //    {
                //        log: logger,
                //        event: 'after'
                //    }
                //)) //tomar cuidado para não logar o token

                this.application.get('/hello', (req, resp, next) => {
                    resp.contentType = 'application/json'
                    resp.send({
                        message: 'Hello',
                        //browser: req.userAgent()
                    })

                    //resp.json({ message: 'Hello' })

                    return next()
                })
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
            } catch (e) {
                reject(e)
            }
        })
    }
    
    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb().then(() => 
            this.initRoutes(routers).then(() => this)) // 
    }
    shutdown() {
        return mongoose.disconnect().then(this.application.close())
    }
}