const request = require("supertest");
const app = require("../app");



let token = null
beforeAll(async() => {
        return request(app)
             .post('/api/v1/auth/login')
            .set('Authorization', 'Bearer ' + token)
            .send({
                email: 'Admin@gmail.com',
                password: '123',
            })
            .expect('Content-Type', /json/)
            .then((response) => {
                token = response.body.data.token;
            })
  
})




describe('Transaction',  () => {

    let transactionid
    it('should be executed the transaction', async() => {
        return request(app)
            .post('/api/v1/executed/c689a7a9-dfae-4fde-8a19-60e243a9207e')
            .set('Authorization', 'Bearer ' + token)
            .send({
                executed : true
            })
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body.message).toBe("Transaction Is Executed")
                expect(response.status).toBe(200)
            })
    })


   
})