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




describe('Transaction',  () => {
    it('should be get Detail Transaction', async() => {
        return request(app)
            .get('/api/v1/transaction/8c9e749b-9d69-43de-86a8-1b66b57c6b79')
            .set('Authorization',   'Bearer ' + token)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.status).toBe(200)
            })
    })

    it('should be get all transaction user', async() => {
        return request(app)
            .get('/api/v1/transaction')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body.message).toBe("My Transaction")
                expect(response.status).toBe(200)
               
            })
    })

    let transactionid
    it('should be buy Mutual funds', async() => {
        return request(app)
            .post('/api/v1/transaction/buy')
            .set('Authorization', 'Bearer ' + token)
            .send({
                mutualfund_id : 'c071945b-3d67-4904-afe6-269a0a1cb824',
                totalamount : 2000,
                payment_method : "QR Code"
            })
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body.message).toBe("Transaction Created")
                expect(response.status).toBe(201)
                transactionid = response.body.data.id
            })
    })


    it('should be sell Mutual funds', async() => {
        return request(app)
            .post('/api/v1/transaction/sell/fddd3a00-94c1-4fa7-8f9d-d3209453474e')
            .set('Authorization', 'Bearer ' + token)
            .send({
                amount : 10,
                payment_method : "Bank Transfer",
            })
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.status).toBe(201)
            })
    })

    it('should be switch mutualfunds', async() => {
        return request(app)
            .post('/api/v1/transaction/switch/fddd3a00-94c1-4fa7-8f9d-d3209453474e')
            .set('Authorization', 'Bearer ' + token)
            .send({
                targetmutualfund_id : "4a71ee41-d951-4393-a777-e94f0c988ce1",
                amount : 250,
            })
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.status).toBe(200)
            })
    })
})