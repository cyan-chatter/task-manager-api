//CRUD -- create read update delete
// C:/Users/DELL/mongo-4/mongodb/bin/mongod.exe --dbpath=C:/Users/DELL/mongo-4/mongodb-data


const mongodb  = require('mongodb')
const{ MongoClient, ObjectID} = require('mongodb')
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// const MongoClient = mongodb.MongoClient

// const ObjectID = mongodb.ObjectID



// const id = new ObjectID()
// console.log(id)


MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client)=>{
     if(error){
         return console.log('Unable to connect to Database')
     }
     const db = client.db(databaseName)

     

//     db.collection('users').insertMany([
//      {
//         name: 'Sayan',
//         age: '19'
//      },{
//         name: 'Leo',
//         age: '18'
//      }
//     ],
//     (error, result)=>{
//         if(error){
//             return console.log('Unable to insert documents')
//         }
//         console.log(result.ops)
//     })

//     db.collection('tasks').insertMany([
//         {
//             description: 'enter narnia through the gate opened by pressing Chandler\'s third nipple',
//             completed: false
//         },
//         {
//            description: 'pick up a girl in a dungeon',
//            completed: false 
        
//         },
//         {
//             description: 'annoy all my enemies to death',
//             completed: true
//         }
//     ], (error, result)=>{
//         if(error){
//             return console.log('Unable to insert documents')
//         }
//         console.log(result.ops)
//     })



    // db.collection('users').findOne({_id: new ObjectID("5f27c81633a91615c0dd9a7b") }, (error, user)=>{
    //     if(error){
    //         return console.log('error')
    //     }else{
    //         console.log(user)
    //     }
    // })


// findOne returns first document in case of duplicate items in db 

    // db.collection('users').find({age: '19'}).toArray((error, users)=>{
    //     console.log(users)
    // })

    // db.collection('users').find({age: '19'}).count((error, c)=>{
    //     console.log(c)
    // })


    // db.collection('tasks').findOne({ _id: new ObjectID("5f27f9a314732818d824c2a0")}, (error, user)=>{
    //     if(error){
    //         return console.log('error')
    //     }else{
    //         console.log(user)
    //     }
    // })

    // db.collection('tasks').find({completed: false}).toArray((e,r)=>{
    //     if(e){
    //         return console.log(e)
    //     }else{
    //         console.log(r)
    //     }
    // })


    //  const updatePromise = db.collection('users').updateOne({
    //      _id: new  ObjectID("5f27b9fef5d2621f9035e858")
    //  },{
    //     //  $set: {
    //     //      name: 'Thorfinn'
    //     //  }


    //  })

    //  updatePromise.then((result)=>{
    //     console.log(result)
    //  }).catch((error)=>{
    //      console.log(error)
    //  })

    //  const updatePromise = db.collection('tasks').updateMany({
    //     completed: false
    // },{
    //      $set: {
    //          completed: true
    //      }

    // })

    // updatePromise.then((result)=>{
    //     console.log(result)
    //  }).catch((error)=>{
    //      console.log(error)
    //  })

    //  db.collection('users').deleteMany({
    //      age: '19'
    //  }).then((result)=>{
    //      console.log(result)
    //  }).catch((error)=>{
    //      console.log(error)
    //  })

    //  db.collection('tasks').deleteOne({
    //     description: 'pick up a girl in a dungeon'
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })
    

    

 })


 