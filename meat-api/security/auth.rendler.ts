import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import { User } from '../users/users.model';
import { NotAuthorizedError } from 'restify-errors';
import { enviroment } from '../common/enviroment';

export const authenticate = (req: restify.Request, resp: restify.Response, next) => {
    const { email, password } = req.body
    User.findByEmail(email, '+password').
        then(user => {
            if (user && user.matches(password)) {
                //gerar o token

                const token = jwt.sign(
                    { sub: user.email, iss: 'meat-api' },
                    enviroment.security.apiSecret)
                resp.json({
                    name: user.name,
                    email: user.email,
                    accessToken: token
                })
                return next(false)
            }
            else {
                return next(new NotAuthorizedError('Credenciais inválidas.'))
            }
        })
    .catch(next)
}