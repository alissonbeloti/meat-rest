import * as restify from 'restify'
import { ForbiddenError } from 'restify-errors';

export const authorize: (...profiles: string[]) => restify.RequestHandler = (...profiles: string[]) => {
    return (req, resp, next) => {
        if (req.authenticated !== undefined && req.authenticated.hasAny(...profiles)) {
            req.log.debug('Autorizado  %s. com os Perfis %j, na rota %s',
                req.authenticated._id, req.authenticated.profiles,
                req.path(),
                profiles
            )
            next()
        } else {
            if (req.authenticated) {
                req.log.debug('Permissão Negada para %s. Perfis requeridos %j. Perfis do usuário %j',
                    req.authenticated._id, profiles, req.authenticated.profiles)
            }
            next(new ForbiddenError('Permissão Negada'))
        }
    }
}