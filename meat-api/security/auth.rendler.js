"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const users_model_1 = require("../users/users.model");
const restify_errors_1 = require("restify-errors");
const enviroment_1 = require("../common/enviroment");
exports.authenticate = (req, resp, next) => {
    const { email, password } = req.body;
    users_model_1.User.findByEmail(email, '+password').
        then(user => {
        if (user && user.matches(password)) {
            //gerar o token
            const token = jwt.sign({ sub: user.email, iss: 'meat-api' }, enviroment_1.enviroment.security.apiSecret);
            resp.json({
                name: user.name,
                email: user.email,
                accessToken: token
            });
            return next(false);
        }
        else {
            return next(new restify_errors_1.NotAuthorizedError('Credenciais inv�lidas.'));
        }
    })
        .catch(next);
};
//# sourceMappingURL=auth.rendler.js.map