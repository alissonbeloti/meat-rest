"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jestCli = require("jest-cli");
const users_router_1 = require("./users/users.router");
const enviroment_1 = require("./common/enviroment");
const server_1 = require("./server/server");
const users_model_1 = require("./users/users.model");
const reveiw_router_1 = require("./reviews/reveiw-router");
const reviews_model_1 = require("./reviews/reviews.model");
let server;
const beforeAllTests = () => {
    enviroment_1.enviroment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db';
    enviroment_1.enviroment.server.port = process.env.SERVER_PORT || 1338;
    server = new server_1.Server();
    return server.bootstrap([
        users_router_1.usersRouter,
        reveiw_router_1.reviewsRouter
    ])
        .then(() => users_model_1.User.remove({}).exec())
        .then(() => {
        let admin = new users_model_1.User();
        admin.name = 'name';
        admin.email = 'admin@email.com';
        admin.password = '123456';
        admin.profiles = ['admin', 'user'];
        return admin.save();
    })
        .then(() => reviews_model_1.Review.remove({}).exec());
};
const afterAllTests = () => {
    return server.shutdown();
};
beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error);
//# sourceMappingURL=jest.startup.js.map