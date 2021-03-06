﻿import * as restify from 'restify'
import { Restaurant } from './restaurants.model'
import { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } from "constants";
import { NotFoundError } from 'restify-errors'
import { ModelRouter } from "../common/model-router";
import { authorize } from '../security/authz.handler';

class RestaurantRouter extends ModelRouter<Restaurant> {
    constructor() {
        super(Restaurant)
    }
    envelope(document) {
        let resource = super.envelope(document)
        resource._links.menu = `${this.basePath}/${resource._id}/menu`  //resource._links.self + "\menu"
        return resource
    }
    findMenu = (req, resp, next) => {
        Restaurant.findById(req.params.id, "+menu")
            .then(rest => {
                if (!rest) {
                    throw new NotFoundError('Restaurante não encontrado')
                }
                else {
                    resp.json(rest.menu)
                    return next()
                }
            }).catch(next)
    }
    replaceMenu = (req, resp, next) => {
        Restaurant.findById(req.params.id)
            .then(rest => {
                if (!rest) {
                    throw new NotFoundError('Restaurante não encontrado')
                }
                else {
                    rest.menu = req.body
                    rest.save()
                }
            })
            .then(rest => {
                resp.json(rest)
                return next()
            })
            .catch(next)
    }
    applyRoutes(application: restify.Server) {
        application.get(`${this.basePath}`, this.findAll)
        application.post(`${this.basePath}`, [authorize('admin'), this.save])
        application.put(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.replace])
        application.patch(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.update])
        application.del(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.delete])
        application.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu])
        application.put(`${this.basePath}/:id/menu`, [authorize('admin'), this.validateId, this.replaceMenu])
    }
}

export const restaurantsRouter = new RestaurantRouter()