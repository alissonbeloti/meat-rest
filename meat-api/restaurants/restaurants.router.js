"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restaurants_model_1 = require("./restaurants.model");
const restify_errors_1 = require("restify-errors");
const model_router_1 = require("../common/model-router");
const authz_handler_1 = require("../security/authz.handler");
class RestaurantRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurants_model_1.Restaurant);
        this.findMenu = (req, resp, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id, "+menu")
                .then(rest => {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Restaurante não encontrado');
                }
                else {
                    resp.json(rest.menu);
                    return next();
                }
            }).catch(next);
        };
        this.replaceMenu = (req, resp, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id)
                .then(rest => {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Restaurante não encontrado');
                }
                else {
                    rest.menu = req.body;
                    rest.save();
                }
            })
                .then(rest => {
                resp.json(rest);
                return next();
            })
                .catch(next);
        };
    }
    envelope(document) {
        let resource = super.envelope(document);
        resource._links.menu = `${this.basePath}/${resource._id}/menu`; //resource._links.self + "\menu"
        return resource;
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, this.findAll);
        application.post(`${this.basePath}`, [authz_handler_1.authorize('admin'), this.save]);
        application.put(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.delete]);
        application.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu]);
        application.put(`${this.basePath}/:id/menu`, [authz_handler_1.authorize('admin'), this.validateId, this.replaceMenu]);
    }
}
exports.restaurantsRouter = new RestaurantRouter();
//# sourceMappingURL=restaurants.router.js.map