﻿import * as restify from 'restify'
import { Review } from './reviews.model'
import { ModelRouter } from "../common/model-router";
import * as mongoose from 'mongoose'
import { authorize } from '../security/authz.handler';

class ReviewRouter extends ModelRouter<Review> {
    constructor() {
        super(Review)
    }
    envelope(document) {
        let resource = super.envelope(document)
        const restId = document.restaurant._id ? document.restaurant._id : document.restaurant
        resource._links.restaurant = `/restaurants/${restId}`  //resource._links.self + "\menu"
        return resource
    }

    protected prepareOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
        return query.populate('user', 'name').populate('restaurant', 'name');
    }
    //findById = (req, resp, next) => {
    //    this.prepareOne(this.model.findById(req.params.id))
    //        .populate('user', 'name')
    //        .populate('restaurant')
    //        .then(this.render(resp, next))
    //        .catch(next)
    //}
    applyRoutes(application: restify.Server) {
        application.get(`${this.basePath}`, this.findAll)
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        application.post(`${this.basePath}`, [authorize('admin', 'user'), this.save])
        application.del(`${this.basePath}/:id`, [authorize('admin', 'user'), this.validateId, this.delete])
    }
}

export const reviewsRouter = new ReviewRouter()