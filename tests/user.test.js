//C:/Users/DELL/mongo-4/mongodb/bin/mongod.exe --dbpath=C:/Users/DELL/mongo-4/mongodb-data

const supertest = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const { 
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    userNakli,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
    } = require('./fixtures/db')


beforeEach(setupDatabase)

test('Should signup a new user',async ()=>{
   const response = await supertest(app).post('/users').send({
        name: 'Sayan Chatterjee',
        age: 19,
        email: 'sparkingblitz@gmail.com',
        password: 'thunder7'
    }).expect(201)

    //assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //assertions about the response
    //expect(response.body.user.name).toBe('Mike')
    expect(response.body).toMatchObject({
        user:{
            name: 'Sayan Chatterjee',
            email: 'sparkingblitz@gmail.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('thunder7')



})

test('Should login existing user', async ()=>{
   const response = await supertest(app)
     .post('/users/login')
     .send({
     email: userOne.email,
     password: userOne.password   
     })
     .expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non-existent user', async ()=>{
    await supertest(app)
     .post('/users/login')
     .send({
       email: userNakli.email,
       password: userNakli.password   
     })
     .expect(400)
})

test('Should not login wrong password user', async ()=>{
   await supertest(app)
    .post('/users/login')
    .send({
     email: userOne.email,
     password: 'submittit!'   
    })
    .expect(400)
})

test('Should get profile for user', async ()=>{
    await supertest(app)
     .get('/users/me')
     .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
     .send()
     .expect(200)
})



test('Should not get profile for unauthorized user', async ()=>{
    await supertest(app)
     .get('/users/me')
     .send()
     .expect(401)
})

test('Should delete the user', async ()=>{
    await supertest(app)
     .delete('/users/me')
     .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
     .send()
     .expect(200)
     const user = await User.findById(userOneId)
     expect(user).toBeNull()  
     
})

test('Should not delete unauthorized user', async (next)=>{
    await supertest(app)
     .delete('/users/me')
     .send()
     .expect(401)
     next() //using next() here because it was preventing jest from exiting
})

test('Should upload avatar image', async ()=>{
    await supertest(app)
     .post('/users/me/avatar')
     .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
     .attach('avatar', 'tests/fixtures/R12.png')
     .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))

}) 

test('Should update user data', async ()=>{
    await supertest(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        name: 'Leo'          
      })
      .expect(200)

    const user= await User.findById(userOneId)
    expect(user.name).toEqual('Leo')  
})

test('Should not update invalid user fields', async ()=>{
    await supertest(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        location: 'Delhi'          
      })
      .expect(400)
})
