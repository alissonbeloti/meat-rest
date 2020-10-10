import 'jest'
import * as request from 'supertest'

let address: string = (<any>global).address
const auth: string = (<any>global).auth

test('get /reviews', () => {
    return request(address)
        .get('/reviews')
        .set('Authorization', auth)
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        }).catch(fail)
})

//test('post /reviews', () => {
//    return request(address)
//        .post('/reviews')
//        .send({
//            name: 'usuario1',
//            email: 'usuario1@email.com',
//            password: '123456',
//            cpf: '962.116.531-82'
//        })
//        .then(response => {
//            expect(response.status).toBe(200)
//            expect(response.body._id).toBeDefined()
//            expect(response.body.name).toBe('usuario1')
//            expect(response.body.email).toBe('usuario1@email.com')
//            expect(response.body.cpf).toBe('962.116.531-82')
//            expect(response.body.password).toBeUndefined()
//        }).catch(fail)
//})


//test('get /reviews/aaaa - not found', () => {
//    return request(address)
//        .get('/reviews/aaaa')
//        .then(response => {
//            expect(response.status).toBe(404)
//        }).catch(fail)
//})