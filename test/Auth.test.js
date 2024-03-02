const request = require("supertest");
const app = require("../app");

describe('auth',  () => {
    it('Should be 200 if username and password right', async() => {
        return request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'tamir@gmail.com',
                password: '123',
            })
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.status).toBe(200)
                expect(response.body.message).toBe('Login Success')
            })
    })

    it('Should be 404 if username and password wrong', async() => {
        return request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'admin1234salah',
                password: 'passwordsalah',
            })
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.status).toBe(404)
            })
    })

    it('Should be 404 and message User not exist', async() => {
        return request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'admin1234salah',
                password: 'passwordsalah',
            })
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.status).toBe(404)
                expect(response.body).toEqual({
                    message: 'User not exist',
                })
            })
    })

    it('Should be 404 and message Password not valid', async() => {
        return request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'tamir@gmail.com',
                password: 'passwordsalah',
            })
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.status).toBe(404)
                expect(response.body).toEqual({
                    message: 'Password not valid',
                })
            })
    })

    it('should register new user', async() => {
        return request(app)
            .post('/api/v1/auth/register')
            .send({
                email: 'eameail@email.com',
                password: '12345678',
                name: 'member123',
            })
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.status).toBe(201)
                expect(response.body.message).toBe('User registration has successful')
            })
    })  
    
    it('Should be 409 Cause Email Already Exist', async() => {
            return request(app)
                .post('/api/v1/auth/register')
                .send({
                    role: 'MEMBER',
                    email: 'email@email.com',
                    password: '12345678',
                    name: 'member123',
                })
                .expect('Content-Type', /json/)
                .then((response) => {
                    expect(response.status).toBe(409)
                    expect(response.body).toEqual({
                        message: 'Email already Exist',
                    })
                })
        })


   
})
