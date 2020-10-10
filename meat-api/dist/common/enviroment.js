"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviroment = {
    server: { port: process.env.SERVER_PORT || 1337 },
    db: {
        url: process.env.DB_URL || 'mongodb://localhost/meat-api',
    },
    security: {
        saltRounds: process.env.SALT_ROUNDS || 10,
        apiSecret: process.env.API_SECRET || 'meat-api-secret',
        enabledHTTPS: process.env.ENABLED_HTTPS || false,
        certificate: process.env.CERTI_FILE || './security/keys/cert.pem',
        key: process.env.CERTI_KEY_FILE || './security/keys/key.pem'
    },
    log: {
        level: process.env.LOG_LEVL || 10,
        name: 'meat-api-logger',
    }
};
//# sourceMappingURL=enviroment.js.map