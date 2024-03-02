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




describe('mutualfunds',  () => {
    it('should be get all mutualfunds', async() => {
        return request(app)
            .get('/api/v1/mutualfunds')
            .set('Authorization',   'Bearer ' + token)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.status).toBe(200)
            })
    })

    it('should be  add mutualfunds', async() => {
        return request(app)
            .post('/api/v1/mutualfunds')
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: "Reksa Dana Amerika",
                company:"PT Sinar Jaya",
                nav:20
            })
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.status).toBe(201)
                expect(response.body.message).toBe("Success Add Mutual Funds")
            })
    })


    it('should be Update mutualfunds', async() => {
        return request(app)
            .put('/api/v1/mutualfunds/acb47a5a-82ff-4aaf-a274-1b6df0e11425')
            .set('Authorization', 'Bearer ' + token)
            .send({
                nav:25
            })
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body.message).toBe("Update Mutual Funds successful")
                expect(response.status).toBe(200)
            })
    })

    it('should be Delete mutualfunds', async() => {
        return request(app)
            .delete('/api/v1/mutualfunds/acb47a5a-82ff-4aaf-a274-1b6df0e11425')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body.message).toBe("Delete Mutual Funds successful")
                expect(response.status).toBe(200)
            })
    })
})