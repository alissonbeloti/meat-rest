"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = (req, resp, err, done) => {
    console.log(err);
    err.toJSON = () => {
        return {
            message: err.message
        };
    };
    switch (err.name) {
        case 'MongoError':
            if (err.code === 11000)
                err.statusCode = 400;
            break;
        case 'validationError':
            err.statusCode = 400;
        case 'ValidationError':
            err.statusCode = 400;
            const messages = []; //criando array
            for (let name in err.errors) {
                messages.push({ message: err.errors[name].message });
            }
            err.toJSON = () => ({
                messages: 'Erro de valida��o no processamento do request',
                errors: messages
            });
            break;
    }
    done();
};
//# sourceMappingURL=error.handler.js.map