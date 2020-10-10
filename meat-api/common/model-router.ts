import { Router } from './router'
import * as mongoose from 'mongoose'
import { NotFoundError } from 'restify-errors';

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    basePath: string
    pageSize: number = 4
    constructor(protected model: mongoose.Model<D>) {
        super()
        this.basePath = `/${model.collection.name}`
    }
    protected prepareOne(query: mongoose.DocumentQuery<D, D>): mongoose.DocumentQuery<D, D> {
        return query;
    }

    envelope(document: any): any {
        let resource = Object.assign({ _links: {} }, document.toJSON());
        resource._links.self = `${this.basePath}/${resource._id}`
        return resource;
    }
    envelopeAll(documents: any[], options: any = {}): any
    {
        const resource: any = {
            _links: {
                self: `${options.url}`
            },
            items: documents
        }
        if (options.page && options.count && options.pageSize) {
            if (options.page > 1) {
                resource._links.previous = `${this.basePath}?_page=${options.page - 1}`
            }
            const remaining = options.count - (options.page * options.pageSize)
            if (remaining > 0) {
                resource._links.next = `${this.basePath}?_page=${options.page + 1}`
            }
        }
        return resource
    }

    validateId = (req, response, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            next(new NotFoundError('Documento não encontrado.'))
        }
        else {
            next()
        }
    }

    findAll = (req, response, next) => {
        let page = parseInt(req.query._page || 1)
        page = page > 0 ? page : 1
        const skip = (page - 1) * this.pageSize
        this.model.count({}).exec()
            .then(count => {
                this.model.find()
                .limit(this.pageSize)
                    .skip(skip)
                    .then(this.renderAll(response, next, {
                          page, count, pageSize: this.pageSize, url: req.url
                        })
                    )
                    .catch(next)
            })
        //response.json({message: 'Users Router'})
    }

    findById = (req, response, next) => {
        //response.json({message: 'Users Router'})
        this.prepareOne(this.model.findById(req.params.id))
            .then(this.render(response, next))
            .catch(next)
    }
    save = (req, response, next) => {
        let modelLoc = new this.model(req.body) //com esse construtor atribuo tudo de uma vez.
        modelLoc.save().then(this.render(response, next))
            .catch(next)
    }
    replace = (req, response, next) => {
        const options = { runValidators: true, overwrite: true } //atualiza completo o arquivo, com propriedade false ele atualiza parcialmente
        this.model.update({ _id: req.params.id }, req.body, options).exec()
            .then(result => {
                if (result.n) {
                    this.model.findById(req.params.id)
                }
                else {
                    throw new NotFoundError("Documento não encontrado!")
                }
            }).then(this.render(response, next))
            .catch(next)
    }
    update = (req, response, next) => {
        const options = { runValidators: true }
        this.model.findByIdAndUpdate(req.params.id, req.body, options)
            .then(this.render(response, next))
            .catch(next)
    }
    delete = (req, resp, next) => {
        this.model.remove({ _id: req.params.id }).exec()
            .then(result => {
                if (result.n) {
                    resp.send(204)
                } else {
                    throw new NotFoundError("Documento não encontrado!")
                }
                return next()
            }
        ).catch(next)
    }
}
