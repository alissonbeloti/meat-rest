import 'jest'
import * as request from 'supertest'
//import { Server } from '../server/server'
//import { enviroment } from '../common/enviroment'
//import { usersRouter } from './users.router'
//import { User } from './users.model'

let address: string = (<any>global).address //"http://localhost:1338"
const auth: string = (<any>global).auth
//let server: Server
//beforeAll(() => {
//    enviroment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db'
//    enviroment.server.port = process.env.SERVER_PORT || 1338
//    address = `http://localhost:${enviroment.server.port}`
//    server = new Server()
//    return server.bootstrap([usersRouter])
//        .then(() => User.remove({}).exec())
//        .catch(console.error)
//})

test('get /users', () => {
    return request(address)
        .get('/users')
        .set('Authorization', auth)
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        }).catch(fail)
})

test('post /users', () => {
    return request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'usuario1',
            email: 'usuario1@email.com',
            password: '123456',
            cpf: '962.116.531-82'
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('usuario1')
            expect(response.body.email).toBe('usuario1@email.com')
            expect(response.body.cpf).toBe('962.116.531-82')
            expect(response.body.password).toBeUndefined()
        }).catch(fail)
})
test('patch /users', () => {
    return request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'usuario2',
            email: 'usuario2@email.com',
            password: '123456',
        })
        .then(response => {
            request(address)
                .patch(`/users/${response.body._id}`)
                .send({
                name: 'usuario2 - patch',
                })
                .then(response => {
                    expect(response.status).toBe(200)
                })
        })
        .catch(fail)
})

test('get /users/aaaa - not found', () => {
    return request(address)
        .get('/users/aaaa')
        .then(response => {
            expect(response.status).toBe(403)
        }).catch(fail)
})

//afterAll(() => {
//    return server.shutdown()
//})
