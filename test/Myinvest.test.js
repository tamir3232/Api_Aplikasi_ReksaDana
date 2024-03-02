const request = require("supertest");
const app = require("../app");



let token = null
beforeAll(async() => {
        return request(app)
             .post('/api/v1/auth/login')
            .set('Authorization', 'Bearer ' + token)
            .send({
                email: 'tamir@gmail.com',
                password: '123',
            })
            .expect('Content-Type', /json/)
            .then((response) => {
                token = response.body.data.token;
            })
  
})




describe('MY INVEST',  () => {
    it('should be get Detail Myinvest', async() => {
        return request(app)
            .get('/api/v1/myinvest/fddd3a00-94c1-4fa7-8f9d-d3209453474e')
            .set('Authorization',   'Bearer ' + token)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.status).toBe(200)
            })
    })

    it('should be get Myinvest user', async() => {
        return request(app)
            .get('/api/v1/myinvest')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.status).toBe(200)
               
            })
    })

   
})