"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reviews_model_1 = require("./reviews.model");
const model_router_1 = require("../common/model-router");
const authz_handler_1 = require("../security/authz.handler");
class ReviewRouter extends model_router_1.ModelRouter {
    constructor() {
        super(reviews_model_1.Review);
    }
    envelope(document) {
        let resource = super.envelope(document);
        const restId = document.restaurant._id ? document.restaurant._id : document.restaurant;
        resource._links.restaurant = `/restaurants/${restId}`; //resource._links.self + "\menu"
        return resource;
    }
    prepareOne(query) {
        return query.populate('user', 'name').populate('restaurant', 'name');
    }
    //findById = (req, resp, next) => {
    //    this.prepareOne(this.model.findById(req.params.id))
    //        .populate('user', 'name')
    //        .populate('restaurant')
    //        .then(this.render(resp, next))
    //        .catch(next)
    //}
    applyRoutes(application) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, [authz_handler_1.authorize('admin', 'user'), this.save]);
        application.del(`${this.basePath}/:id`, [authz_handler_1.authorize('admin', 'user'), this.validateId, this.delete]);
    }
}
exports.reviewsRouter = new ReviewRouter();
//# sourceMappingURL=reveiw-router.js.map