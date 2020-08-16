const supertest = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
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

test('Should create task for user', async ()=>{
    const response = await supertest(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)
    
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should fetch user tasks', async ()=>{
    const response = await supertest(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Should not delete task of other user', async ()=>{
    const response = await supertest(app)
        .delete(`/tasks/${taskTwo._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskTwo._id)
    expect(task).not.toBeNull()
})

