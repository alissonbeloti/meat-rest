"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = require("./users.model");
const model_router_1 = require("../common/model-router");
const auth_rendler_1 = require("../security/auth.rendler");
const authz_handler_1 = require("../security/authz.handler");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.findByEmail = (req, resp, next) => {
            if (req.query.email) {
                users_model_1.User.findByEmail(req.query.email)
                    .then(user => {
                    if (user)
                        return [user];
                    else
                        return [];
                }) //renderAll trabalha com array e findByEmail retorna apenas 1 item
                    .then(this.renderAll(resp, next, {
                    pageSize: this.pageSize,
                    url: req.url
                }))
                    .catch(next);
            }
            else {
                next();
            }
        };
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
        application.get({ path: `${this.basePath}`, version: '2.0.0' }, [authz_handler_1.authorize('admin'), this.findByEmail, this.findAll]);
        //application.get({ path: `${this.basePath}`, version: '1.0.0' }, [this.findAll])
        application.get(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.findById]);
        application.post(`${this.basePath}`, [authz_handler_1.authorize('admin'), this.save]);
        application.put(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.delete]);
        application.post(`${this.basePath}/authenticate`, auth_rendler_1.authenticate);
    }
}
exports.usersRouter = new UsersRouter();
//# sourceMappingURL=users.router.js.map