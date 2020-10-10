"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
exports.authorize = (...profiles) => {
    return (req, resp, next) => {
        if (req.authenticated !== undefined && req.authenticated.hasAny(...profiles)) {
            req.log.debug('Autorizado  %s. com os Perfis %j, na rota %s', req.authenticated._id, req.authenticated.profiles, req.path(), profiles);
            next();
        }
        else {
            if (req.authenticated) {
                req.log.debug('Permiss�o Negada para %s. Perfis requeridos %j. Perfis do usu�rio %j', req.authenticated._id, profiles, req.authenticated.profiles);
            }
            next(new restify_errors_1.ForbiddenError('Permiss�o Negada'));
        }
    };
};
//# sourceMappingURL=authz.handler.js.map