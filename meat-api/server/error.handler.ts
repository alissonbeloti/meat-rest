import * as restify from 'restify'

export const handleError = (req: restify.Request, resp: restify.Response, err, done) => {
    console.log(err)
    err.toJSON = () => {
        return {
            message: err.message
        }
    }
    switch (err.name) {
        case 'MongoError':
            if (err.code === 11000)
                err.statusCode = 400
            break;
        case 'validationError':
            err.statusCode = 400;
        case 'ValidationError':
            err.statusCode = 400
            const messages: any[] = [] //criando array
            for (let name in err.errors) {
                messages.push({ message: err.errors[name].message })
            }
            err.toJSON = () => ({
                messages: 'Erro de validação no processamento do request',
                errors: messages
            })
            break
    }
    done()
}