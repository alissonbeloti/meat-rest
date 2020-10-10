import * as jestCli from 'jest-cli'
import { usersRouter } from "./users/users.router";
import { enviroment } from "./common/enviroment";
import { Server } from "./server/server";
import { User } from "./users/users.model";
import { reviewsRouter } from "./reviews/reveiw-router";
import { Review } from "./reviews/reviews.model";

let server: Server

const beforeAllTests = () => {
    enviroment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db'
    enviroment.server.port = process.env.SERVER_PORT || 1338
    server = new Server()
    return server.bootstrap([
        usersRouter,
        reviewsRouter
    ])
        .then(() => User.remove({}).exec())
        .then(() => {
            let admin = new User()
            admin.name = 'name'
            admin.email = 'admin@email.com'
            admin.password = '123456'
            admin.profiles = ['admin', 'user']
            return admin.save()
        })
        .then(() => Review.remove({}).exec())
}

const afterAllTests = () => {
    return server.shutdown()
}

beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
.catch(console.error)