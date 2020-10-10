import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import { User } from '../users/users.model';
import { enviroment } from '../common/enviroment';
import { Document } from 'mongoose';

export const tokenParser: restify.RequestHandler = (req, resp, next) => {
    const token = extractToken(req)
    if (token) {
        jwt.verify(token, enviroment.security.apiSecret, applyBearer(req, next)) //Garante que n�o ser� utilizado qualquer token falsamente produzido.
    } else {
        next()
    }
}

function extractToken(req: restify.Request) {
    //Autorization: Bearer TOKEN
    let token = undefined
    const authorization = req.header('authorization')
    if (authorization) {
        const parts: string[] = authorization.split(' ')
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
        }
    }
    return token
}


function applyBearer(req: restify.Request, next): (error, decoded) => void {
    return (error, decoded) => {
        if (decoded) {
            User.findByEmail(decoded.sub).then(user => {
                if (user) {
                    //associar o usuario no request
                    req.authenticated = user
                }
                next()
            }).catch(next)
        } else {
            next()
        }
    } 
}